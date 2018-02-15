const strategies = {
    sortByWeight(routes) {
        routes.sort((a, b) => {
            a.meta = a.meta || {}
            b.meta = b.meta || {}

            const weightA = a.meta.weight || 0
            const weightB = b.meta.weight || 0

            return weightB - weightA
        })
        return routes
    }
}

module.exports = strategies