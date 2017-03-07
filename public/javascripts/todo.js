const DEBUG = false;
if (window.jQuery) {
    $(function () {
        var Todo = {
            api: {
                _getAll: {
                    url: '/todo/api/get-all',
                    method: 'GET'
                },
                _insertCategory: {
                    url: '/todo/api/cat/add',
                    method: 'POST'
                },
                _insertItem: {
                    url: '/todo/api/item/add',
                    method: 'POST'
                }
            },

            start: function () {
                this.showAllCategory();
                $(document).on('click', '#fn-add-cat', function () {
                    Todo.addCategory();
                });
                $(document).on('submit', 'form', function (e) {
                    e.preventDefault();
                    Todo.addItemInCategory(this);
                });
            },

            showAllCategory: function () {
                $.ajax({
                    url: Todo.api._getAll.url,
                    type: Todo.api._getAll.method,
                    dataType: 'JSON',
                    success: function (resp) {
                        if (DEBUG) {
                            console.log(resp);
                        }
                        if (!resp.err) {
                            let catLength = resp.data.length;
                            for (let i = 0; i < catLength; i++) {
                                let newTd = $('<td />').attr({}).html(resp.data[i].title);
                                let newTr = $('<tr />').append(newTd);
                                $("#cat-body").append(newTr);
                                let formAddItem = Todo.createAddItemForm(resp.data[i].id);
                                let _$this = $(newTd);
                                _$this.append(formAddItem);
                                Todo.showItemInCat(_$this, resp.data[i].id, resp.data[i].items);
                            }
                        }
                    },
                    error: function (err) {
                        if (DEBUG) {
                            console.log(err);
                        }
                    }
                })
            },

            showItemInCat: function (_$this, catId, items) {
                let itemLength = items ? items.length : 0;
                let newTable = $('<table />').attr({
                    class: 'table table-bordered table-striped',
                    'data-catId': catId
                })
                        .append('<tr><td>Title</td><td>Description</td><td>Create at</td></tr>');

                for (let i = 0; i < itemLength; i++) {
                    let newTdTitle = $('<td />').attr({}).html(items[i].title);
                    let newTdDes = $('<td />').attr({}).html(items[i].description);
                    let newTdCreated = $('<td />').attr({}).html(items[i].create_at);
                    let newTr = $('<tr />').append(newTdTitle).append(newTdDes).append(newTdCreated);
                    $(newTable).append(newTr);
                }

                _$this.append(newTable);
            },

            addCategory: function () {
                let catTitle = $('#cat-title').val();
                if (!catTitle) {
                    alert('Please check your input');
                    return false;
                }
                $.ajax({
                    url: Todo.api._insertCategory.url,
                    type: Todo.api._insertCategory.method,
                    dataType: 'JSON',
                    data: {
                        title: catTitle
                    },
                    success: function (resp) {
                        if (DEBUG) {
                            console.log(resp);
                        }
                        if (!resp.err) {
                            let catLength = resp.data.length;
                            let newTd = $('<td />').attr({}).html(resp.data.title);
                            let newTr = $('<tr />').append(newTd);
                            $("#cat-body").append(newTr);
                            let inputAddItem = Todo.createAddItemForm(resp.data.id);
                            let _$this = $(newTd);
                            _$this.append(inputAddItem);
                            Todo.showItemInCat($(newTd), resp.data.id, null);
                        }
                    },
                    error: function (err) {
                        if (DEBUG) {
                            console.log(err);
                        }
                    }
                })
            },

            addItemInCategory: function (_this) {                
                $.ajax({
                    url: Todo.api._insertItem.url,
                    type: Todo.api._insertItem.method,
                    dataType: 'JSON',
                    data: $(_this).serializeArray(),
                    success: function (resp) {
                        if (DEBUG) {
                            console.log(resp);
                        }
                        if (!resp.err) {
                            let length = resp.data.items.length;
                            let newItem = resp.data.items[length - 1];
                            let newTdTitle = $('<td />').attr({}).html(newItem.title);
                            let newTdDes = $('<td />').attr({}).html(newItem.description);
                            let newTdCreated = $('<td />').attr({}).html(newItem.create_at);
                            let newTr = $('<tr />').append(newTdTitle).append(newTdDes).append(newTdCreated);
                            let catId = $(_this).attr('data-catId');

                            $('table[data-catId="' + catId + '"]').append(newTr);

                        }
                    },
                    error: function (err) {
                        if (DEBUG) {
                            console.log(err);
                        }
                    }
                })
            },

            createAddItemForm: function (catId) {
                let $form = $('<form />').attr({
                    class: 'form-group',
                    'data-catId': catId
                });
                let $input = $('<input />').attr({
                    class: 'form-control',
                    name: 'title'
                }).prop('required',true);
                let $textarea = $('<textarea />').attr({
                    class: 'form-control',
                    name: 'description'
                }).prop('required',true);
                let infoCatId = $('<input />').attr({
                    class: 'form-control',
                    name: 'catId',
                    value: catId,
                    type: 'hidden'
                });
                let $button = $('<button />').attr({
                    class: 'btn btn-default'
                }).html('Add');
                $form.append($input).append($textarea).append($button).append(infoCatId);
                return $form;
            },
        }

        try {
            if (typeof Todo === 'object') {
                Todo.start();
            }
        } catch (e) {
            console.log('Exception at runtime in Todo.start');
        }

    });
}