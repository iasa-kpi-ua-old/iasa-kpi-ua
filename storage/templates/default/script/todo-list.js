function addItemFromHtml() {
    var form_control = $('.form-control');
    var itemVal = form_control.val();
    if (!itemVal) {
        $('.err').removeClass('hidden').addClass('animated bounceIn');
    } else {
        addItem(itemVal, false, true)
    }

    form_control.val('').attr('placeholder', 'Add item...');
}

function addItem(text, completed, require_update) {
    var additional_class = completed ? ' danger' : '';
    var item = '<li class="animated flipInX' + additional_class + '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><label><span class="checkbox-mask"></span><input type="checkbox" />' + text + '</label></div></li>';

    var err = $('.err');
    if (!err.hasClass('hidder')) {
        err.addClass('hidden');
    }
    $('.todo-list').append(item);
    if (require_update) {
        $.post('/todo/list/send',
            {
                text: text,
                completed: completed
            }
        )
    }


    var no_items = $('.no-items');
    if (!no_items.hasClass('hidden')) {
        no_items.addClass('hidden');
    }

    setTimeout(function () {
        $('.todo-list li').removeClass('animated flipInX');
    }, 500);
}

function refresh() {

    $('.todo-list li').each(function (i) {
        $(this).delay(70 * i).queue(function () {
            $(this).addClass('animated bounceOutLeft');
            $(this).dequeue();
        });
    });

    setTimeout(function () {
        $.post('/todo/list/get', function (data) {
            $('.todo-list li').remove();
            JSON.parse(data).forEach(function (item) {
                addItem(item['text'], item['completed'], false)
            })
        });
    }, 800);
}

$(function () {


    $('.add-btn').on('click', addItemFromHtml);

    $('.refresh').on('click', refresh);

    var todo_list = $('.todo-list');

    todo_list.on('click', 'input[type="checkbox"]', function () {
        $.post('/todo/list/send',
            {
                text: $(this).parent().text().trim(),
                completed: !($(this).parent().parent().parent().hasClass('danger'))
            }
        );
        $(this).parent().parent().parent().toggleClass('danger');
        var li = $(this).parent().parent().parent();
        li.toggleClass('animated flipInX');
        setTimeout(function () {
            li.removeClass('animated flipInX');
        }, 500);
    });

    todo_list.on('click', '.close', function () {
        var box = $(this).parent().parent();
        if (!box.hasClass('danger')) {
            if (!window.confirm("Are you sure want to delete uncompleted task?")) {
                return;
            }
        }
        $.post('/todo/list/remove',
            {
                text: $(this).parent().text().trim()
            }
        );

        if ($('.todo-list li').length == 1) {
            setTimeout(function () {
                $('.no-items').removeClass('hidden');
            }, 500);
        }
        box.removeClass('animated flipInX').addClass('animated bounceOutLeft');
        setTimeout(function () {
            box.remove();
        }, 500);
    });

    $('.form-control').keypress(function (e) {
        if (e.which == 13) {
            addItemFromHtml();
        }
    });

    todo_list.sortable();
    todo_list.disableSelection();

});