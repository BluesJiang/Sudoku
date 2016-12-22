$(function () {
    var static_grid = new Array()
    var table_status = new Array()
    var row_status = new Array()
    var col_status = new Array()
    for (var i = 0; i < 9; i++) {
        table_status.push(new Array())
        row_status.push(new Array())
        col_status.push(new Array())
        for (var j = 0; j <= 9; j++) {
            table_status[i].push(false)
            row_status[i].push(false)
            col_status[i].push(false)
        }
    }
    var oparation_queue = new Array()
    function highlight_grid(grid) {
        grid.css('background-color', '#996600')
        grid.attr('chosen', true)
        seleced_grid = grid;
    }

    function set_grid_val(tabn, rown, coln, val) {
        var grid = get_grid(tabn, rown, coln)
        console.log(grid)
        console.log('val '+val)
        grid.children().text(''+val)
    }
    function unset_grid_val(tabn, rown, coln, val) {
        var grid = get_grid(tabn, rown, coln)
        grid.children().text('')
    }

    function dishighlight_grid(grid) {
        grid.css('background-color', 'inherit')
        grid.attr('chosen', false)
        seleced_grid = null;
    }

    var main_table =  $('.main_table');
    for (var i = 0; i < 9 ; i++) {
        if (i % 3 == 0) {
            main_table.append('<tr></tr>')
        }
        var main_table_row = main_table.children().last()
        console.log(main_table_row)
        var table = '<td class="large_table"><table class="grid_table" tabn='+i+'></table></td>'
        main_table_row.append(table);
        table = $('.grid_table').last();
        for (var j = 0; j < 3; j++) {
            table.append('<tr class="row" row='+j+'></tr>');
            var row = table.children().last();
            for (var k = 0; k < 3; k++) {
                var td = (j*3+k+1);
                 row.append('<td class="grid" col='+k+' idx='+i+j+k+' chosen="false"><span class="grid_text"><span></td>');
            }
            
        }
    }
    var grids = $('.grid')
    var seleced_grid = null;
    for (var i = 0; i < grids.length; i++) {
        $(grids[i]).click(function(){
            console.log('table:'+$(this).parent().parent().attr('tabn'))
            console.log('row:'+$(this).parent().attr('row'))
            console.log('col:'+$(this).attr('col'))
            var grid = $(this)
            if (grid.attr('chosen') === "false") {
                if (seleced_grid !== null) {
                    dishighlight_grid(seleced_grid)
                }
                highlight_grid(grid)
            }else {
                dishighlight_grid(grid)
            }
        })
    }

    $(window).keydown(function(event){
        console.log(String.fromCharCode(event.which))
        if (seleced_grid !== null) {
            console.log(seleced_grid)
            var val = parseInt(String.fromCharCode(event.which))
            console.log(val)
            var tabn = parseInt(seleced_grid.parent().parent().attr('tabn'))
            var row = parseInt(seleced_grid.parent().attr('row'))
            var col = parseInt(seleced_grid.attr('col'))
            if (check(tabn, row, col, val)===true) {
                seleced_grid.children().text(val)
                set_status(tabn, row, col, val)
                static_grid.push([tabn, row, col])
                console.log([tabn ,row, col, val])
            } else {
                alert('有冲突！')
            }
            dishighlight_grid(seleced_grid)

        }
    })
    $('button').click(btnClick)





    

    function get_grid(tabn, row, col) {
        return $('[idx='+tabn+row+col+']')
    }


  
    function check(tabn, rown, coln, val) {
        console.log('checking: '+tabn+' '+rown+' '+coln+' '+val)
        var row = parseInt(tabn/3)*3+rown
        var col = parseInt(tabn % 3)*3+coln
        if (table_status[tabn][val] === true ||
            row_status[row][val] === true ||
            col_status[col][val] === true) {
            return false
        } 
        return true //表示可以放置
    }

    function check_static(tabn, rown, coln) {
        for (var i = 0; i < static_grid.length; i++) {
            if (static_grid[i][0] === tabn &&
                static_grid[i][1] === rown &&
                static_grid[i][2] === coln ) {
                    console.log('find static grid')
                    return true
            }
        }
        return false
    }

    function set_status(tabn, rown, coln, val) {
        
        var row = parseInt(tabn/3)*3+rown
        var col = parseInt(tabn % 3)*3+coln
        console.log('setting:'+[tabn, row, col, val])
        table_status[tabn][val] = true 
        row_status[row][val] = true 
        col_status[col][val] = true
    }

    function unset_status(tabn, rown, coln, val) {
        var row = parseInt(tabn/3)*3+rown
        var col = parseInt(tabn % 3)*3+coln
        table_status[tabn][val] = false 
        row_status[row][val] = false 
        col_status[col][val] = false
    }
    var success = false

    function do_operation() {
        var list = oparation_queue.shift()
        if (list !== undefined) {
            var op = list[0]
            op(list[1], list[2], list[3], list[4])
            if (op === unset_grid_val) {
                setTimeout(do_operation, 10)
            } else {
                setTimeout(do_operation, 50)
            }
            
        }
        console.log('doing')
        
    }

    
    function btnClick() {
        generate(0, 0, 0)
        do_operation()

    }
    function find_next(tabn, rown, coln) {
        var tab = tabn
        var row = rown
        var col = coln
        col ++
        if (col === 3) {
            col = 0
            row ++
        }
        if (row === 3) {
            row = 0
            tab ++
        }
        return [tab, row, col]
    }

    function generate(tabn, rown, coln) {
        if (check_static(tabn, rown, coln) === true) {
            var next = find_next(tabn, rown, coln)
                var tab = next[0]
                var row = next[1]
                var col = next[2]
                generate(tab, row, col)
        } else {
            for (var val = 1; val <= 9; val++) {
                if (check(tabn, rown, coln, val) === true) {
                    set_status(tabn, rown, coln, val)
                    oparation_queue.push([set_grid_val, tabn, rown, coln, val])
                    var next = find_next(tabn, rown, coln)
                    var tab = next[0]
                    var row = next[1]
                    var col = next[2]
                    if (tab === 9) {
                        success = true
                        return
                    }
                    generate(tab, row, col)
                    if (success) return
                    unset_status(tabn, rown, coln, val)
                    oparation_queue.push([unset_grid_val, tabn, rown, coln, val])
                }
            }
        }
    }
    

})

   
