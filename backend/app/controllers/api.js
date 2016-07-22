module.exports = {
    getUsers: function*() {
        this.body = this.query.query
            ? yield this.app.models.users.findByQuery(this.query.query)
            : yield this.app.models.users.findAll()
    },
};