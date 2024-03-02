import * as React from "react";

import {
  GraphView,
  type IEdge,
  type INode,
  type INodeProps,
  type LayoutEngineType,
  type SelectionT,
  type IPoint,
} from "react-digraph";
import GraphConfig, {
  edgeTypes,
  EMPTY_EDGE_TYPE,
  EMPTY_TYPE,
  NODE_KEY,
  nodeTypes,
  COMPLEX_CIRCLE_TYPE,
  POLY_TYPE,
  SPECIAL_CHILD_SUBTYPE,
  SPECIAL_EDGE_TYPE,
  SPECIAL_TYPE,
  SKINNY_TYPE,
} from "./config"; // Configures node/edge types

type IGraph = {
  nodes: INode[];
  edges: IEdge[];
};

// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.
const sample: IGraph = {
  edges: [
    {
      handleText: "5",
      source: "A",
      target: "B",
      type: SPECIAL_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "A",
      target: "C",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "B",
      target: "C",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "C",
      target: "D",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "C",
      target: "F",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "D",
      target: "E",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "54",
      source: "E",
      target: "F",
      type: EMPTY_EDGE_TYPE,
    },
    {
      handleText: "24",
      source: "F",
      target: "A",
      type: EMPTY_EDGE_TYPE,
    },
  ],
  nodes: [
    {
      id: "A",
      title: "A",
      type: EMPTY_TYPE,
      x: 0,
      y: 0,
    },
    {
      id: "B",
      title: "B",
      type: SPECIAL_TYPE,
      x: 500,
      y: 0,
    },
    {
      id: "C",
      title: "C",
      type: EMPTY_TYPE,
      x: 750,
      y: 250,
    },
    {
      id: "D",
      title: "D",
      type: EMPTY_TYPE,
      x: 500,
      y: 500,
    },
    {
      id: "E",
      title: "E",
      type: EMPTY_TYPE,
      x: 0,
      y: 500,
    },
    {
      id: "F",
      title: "F",
      type: EMPTY_TYPE,
      x: -250,
      y: 250,
    },
  ],
};

type IIntermediateNodes = INode & {
  has_pawn: boolean;
  global_moving: boolean;
  walkable: boolean;
}

type IGraphProps = {};

type IGraphState = {
  nodes: INode[];
  graph: IGraph;
  // selected: any;
  selected: SelectionT | null;
  totalNodes: number;
  copiedNode: null | INode;
  copiedNodes: null | INode[];
  copiedEdges: null | IEdge[];
  layoutEngineType?: LayoutEngineType;
  allowMultiselect: boolean;
  locationOverrides?: Object;
  moving: boolean;
  pawn_location: string;
  intermediate_nodes: IIntermediateNodes[];
  warn_message: string;
};

function generate_intermediate(nodes: INode[], pawn_location: string, moving: boolean): IIntermediateNodes[] {
  console.log(nodes);

  const aa = nodes.map(node => {
    return {
      ...node,
      has_pawn: node.id === pawn_location,
      global_moving: moving,
      walkable: sample.edges.find(edge => (edge.source === pawn_location) && (edge.target === node.id)) !== undefined,
    }
  });
  console.log(aa);

  return aa
}

class MyGraph extends React.Component<IGraphProps, IGraphState> {
  GraphView: any;

  handleChange() {
    const new_moving = !this.state.moving;
    const new_intermediate_nodes = generate_intermediate(sample.nodes, this.state.pawn_location, new_moving);
    this.setState({ ...this.state, moving: new_moving, intermediate_nodes: new_intermediate_nodes });
  };

  constructor(props: IGraphProps) {
    super(props);

    const initial_pawn_location = 'A';
    const initial_moving = false;

    this.state = {
      copiedNode: null,
      copiedNodes: null,
      copiedEdges: null,
      intermediate_nodes: generate_intermediate(sample.nodes, initial_pawn_location, initial_moving),
      graph: sample,
      layoutEngineType: undefined,
      selected: null,
      selectedNodes: null,
      selectedEdges: null,
      totalNodes: sample.nodes.length,
      allowMultiselect: true,
      locationOverrides: {},
      pawn_location: initial_pawn_location,
      moving: initial_moving,
      warn_message: '',
    };

    this.GraphView = React.createRef();
  }

  // Helper to find the index of a given node
  getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex((node) => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge: IEdge) {
    return this.state.graph.edges.findIndex((edge) => {
      return (
        edge.source === searchEdge.source && edge.target === searchEdge.target
      );
    });
  }

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = (
    viewNode: INode,
    selectedNodes: Map<string, INode>,
    position?: Object,
  ) => {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);
    const overrides = {
      ...this.state.locationOverrides,
      [viewNode.id]: position,
    };

    graph.nodes[i] = viewNode;
    this.setState({ graph, locationOverrides: overrides });
  };

  update_pawn(selected) {
    if (!this.state.moving) {
      this.setState({ warn_message: 'cannot move in non-moving state!' })
      return
    }
    for (const [_, node] of selected.nodes) {
      if (node.walkable) {
        this.setState({ warn_message: '' })
        console.log(`move pawn to ${this.state.pawn_location}`)
        this.setState({ pawn_location: node.id, intermediate_nodes: generate_intermediate(sample.nodes, node.id, true) })
      } else {
        this.setState({ warn_message: 'cannot go to this state since not walkable!' });
      }
      return
    }
  }

  onSelect = (selected: SelectionT, event: Any) => {
    console.log(selected, event);
    this.setState({
      selected,
    });
    if (event) {
      // TODO: considered a mouse click event; might be wrong
      this.update_pawn(selected);
    }
  };

  // Updates the graph with a new node
  onCreateNode = (x: number, y: number) => {
    const graph = this.state.graph;

    // This is just an example - any sort of logic
    // could be used here to determine node type
    // There is also support for subtypes. (see 'sample' above)
    // The subtype geometry will underlay the 'type' geometry for a node
    const type = Math.random() < 0.25 ? SPECIAL_TYPE : EMPTY_TYPE;

    const viewNode = {
      id: Date.now(),
      title: "",
      type,
      x,
      y,
    };

    graph.nodes = [...graph.nodes, viewNode];
    this.setState({ graph });
  };

  // Deletes a node from the graph
  onDeleteNode = (viewNode: INode, nodeId: string, nodeArr: INode[]) => {
    // Note: onDeleteEdge is also called from react-digraph for connected nodes
    const graph = this.state.graph;

    graph.nodes = nodeArr;

    this.deleteEdgesForNode(nodeId);

    this.setState({ graph, selected: null });
  };

  // Whenever a node is deleted the consumer must delete any connected edges.
  // react-digraph won't call deleteEdge for multi-selected edges, only single edge selections.
  deleteEdgesForNode(nodeID: string) {
    const { graph } = this.state;
    const edgesToDelete = graph.edges.filter(
      (edge) => edge.source === nodeID || edge.target === nodeID,
    );

    const newEdges = graph.edges.filter(
      (edge) => edge.source !== nodeID && edge.target !== nodeID,
    );

    edgesToDelete.forEach((edge) => {
      this.onDeleteEdge(edge, newEdges);
    });
  }

  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
    const graph = this.state.graph;
    // This is just an example - any sort of logic
    // could be used here to determine edge type
    const type =
      sourceViewNode.type === SPECIAL_TYPE
        ? SPECIAL_EDGE_TYPE
        : EMPTY_EDGE_TYPE;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type,
    };

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      graph.edges = [...graph.edges, viewEdge];
      this.setState({
        graph,
        selected: {
          nodes: null,
          edges: new Map([[`${viewEdge.source}_${viewEdge.target}`, viewEdge]]),
        },
      });
    }
  };

  // Called when an edge is reattached to a different target.
  onSwapEdge = (
    sourceViewNode: INode,
    targetViewNode: INode,
    viewEdge: IEdge,
  ) => {
    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference if you want the graph to re-render a swapped edge
    graph.edges = [...graph.edges];

    this.setState({
      graph,
      selected: edge,
    });
  };

  // Called when an edge is deleted
  onDeleteEdge = (viewEdge: IEdge, edges: IEdge[]) => {
    const graph = this.state.graph;

    graph.edges = edges;
    this.setState({
      graph,
      selected: null,
    });
  };

  onUndo = () => {
    // Not implemented
    console.warn("Undo is not currently implemented in the example.");
    // Normally any add, remove, or update would record the action in an array.
    // In order to undo it one would simply call the inverse of the action performed. For instance, if someone
    // called onDeleteEdge with (viewEdge, i, edges) then an undelete would be a splicing the original viewEdge
    // into the edges array at position i.
  };

  onCopySelected = () => {
    // This is a no-op. Maybe log something if you want.
    // Pasting uses the state.selected property within the onPasteSelected function.
  };

  // Pastes the selection to mouse position
  onPasteSelected = (selection?: SelectionT | null, mousePosition?: IPoint) => {
    // const { graph, selected } = this.state;
    // const { x: mouseX, y: mouseY } = mousePosition || { x: 0, y: 0 };

    // if (!selected?.nodes?.size) {
    //   // do nothing if there are no nodes selected
    //   return;
    // }

    // let cornerX;
    // let cornerY;

    // selected?.nodes?.forEach((copiedNode: INode) => {
    //   // find left-most node and record x position
    //   if (cornerX == null || (copiedNode.x || 0) < cornerX) {
    //     cornerX = copiedNode.x || 0;
    //   }

    //   // find top-most node and record y position
    //   if (cornerY == null || (copiedNode.y || 0) < cornerY) {
    //     cornerY = copiedNode.y || 0;
    //   }
    // });

    // // Keep track of the mapping of old IDs to new IDs
    // // so we can recreate the edges
    // const newIDs = {};

    // // Every node position is relative to the top and left-most corner
    // const newNodes = new Map(
    //   [...(selected?.nodes?.values() || [])].map((copiedNode: INode) => {
    //     const x = mouseX + ((copiedNode.x || 0) - cornerX);
    //     const y = mouseY + ((copiedNode.y || 0) - cornerY);

    //     // Here you would usually create a new node using an API
    //     // We don't have an API, so we'll mock out the node ID
    //     // and create a copied node.
    //     const id = `${copiedNode.id}_${Date.now()}`;

    //     newIDs[copiedNode.id] = id;

    //     return [
    //       id,
    //       {
    //         ...copiedNode,
    //         id,
    //         x,
    //         y,
    //       },
    //     ];
    //   }),
    // );

    // const newEdges = new Map(
    //   [...(selected?.edges?.values() || [])].map((copiedEdge) => {
    //     const source = newIDs[copiedEdge.source];
    //     const target = newIDs[copiedEdge.target];

    //     return [
    //       `${source}_${target}`,
    //       {
    //         ...copiedEdge,
    //         source,
    //         target,
    //       },
    //     ];
    //   }),
    // );

    // graph.nodes = [...graph.nodes, ...Array.from(newNodes.values())];
    // graph.edges = [...graph.edges, ...Array.from(newEdges.values())];

    // // Select the new nodes and edges
    // this.setState({
    //   selected: {
    //     nodes: newNodes,
    //     edges: newEdges,
    //   },
    // });
  };

  /*
   * Context Menu
   */
  onContextMenu(x: number, y: number, event) {
    console.log(x);
    console.log(y);
    console.log(event);
  };

  /*
   * Render
   */

  renderNodeText(data, id, isSelected) {
    // console.log(data)
    const can_move = data.global_moving && data.walkable;
    // const pawn_text = `Pawn here: ${data.has_pawn}`;
    const pawn_text = data.has_pawn ? 'pawn ' : ''
    // const move_text = can_move ? 'You can move here' : 'Nope'
    const move_text = can_move ? 'next possible move' : ''

    return (<text>
      {pawn_text}
      <br />
      {move_text}
      <br />
      {data.id}
    </text>)
  }

  render() {
    const { nodes, edges } = this.state.graph;
    const { selected, allowMultiselect, layoutEngineType } = this.state;
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;

    return (
      <>
        <h3 style={{ color: 'red' }}>{this.state.warn_message}</h3>
        <div id="graph" style={{ height: "450px", width: "900px" }}>
          <GraphView
            // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
            ref={el => (this.GraphView = el)}
            allowMultiselect={allowMultiselect}
            nodeKey={NODE_KEY}
            nodes={this.state.intermediate_nodes}
            edges={edges}
            selected={selected}
            nodeTypes={NodeTypes}
            nodeSubtypes={NodeSubtypes}
            edgeTypes={EdgeTypes}
            onSelect={this.onSelect}
            onCreateNode={this.onCreateNode}
            onUpdateNode={this.onUpdateNode}
            onContextMenu={this.onContextMenu}
            onDeleteNode={this.onDeleteNode}
            onCreateEdge={this.onCreateEdge}
            onSwapEdge={this.onSwapEdge}
            onDeleteEdge={this.onDeleteEdge}
            onUndo={this.onUndo}
            onCopySelected={this.onCopySelected}
            onPasteSelected={this.onPasteSelected}
            layoutEngineType={layoutEngineType}
            nodeLocationOverrides={this.state.locationOverrides}
            renderNodeText={this.renderNodeText}
          />
          {/* <Button></Button> */}
          <label>
            <input
              type="checkbox"
              checked={this.state.moving}
              onChange={() => this.handleChange()}
            />
            moveable?
          </label>
          <p>Can you move? {this.state.moving.toString()}</p>
        </div>
      </>
    );
  }
}

export default MyGraph;
