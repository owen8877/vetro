function is_production() {
    return process.env.NODE_ENV === 'production';
}

export default is_production