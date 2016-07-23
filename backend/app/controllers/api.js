module.exports = {
    getUsers: function*() {
        console.log('query', this.query);
        this.body = this.query.query
            ? yield this.app.models.users.findByQuery(this.query.query)
            : yield this.app.models.users.findAll()
    },
};