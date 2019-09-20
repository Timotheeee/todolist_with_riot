class TodosCollection {

    constructor(tag) {
        this.collection = [{name: "foo", done: true }, { name: "bar" }];
        if(tag) {
            this.riotjs_tag = tag;
        }
    }

    all() {
        return this.collection;
    }

    add(model) {
        this.collection.push(model);
        this.riotjs_tag.update();
    }
}
