$(function () {
    //   var static_grid = new Array()
    //   var table_status = new Array()
    //   var row_status = new Array()
    //   var col_status = new Array()
    //   var oparation_queue = new Array()
    var seleced_grid = null
    var startime = null
    //   var success = false
    //   var is_cleared = true
    // function init_status() {
    //   static_grid = new Array()
    //   table_status = new Array()
    //   row_status = new Array()
    //   col_status = new Array()
    //   grid_sets = new Array()
    //   for (var i = 0; i < 9; i++) {
    //     table_status.push(new Array())
    //     row_status.push(new Array())
    //     col_status.push(new Array())
    //     for (var j = 0; j <= 9; j++) {
    //         table_status[i].push(false)
    //         row_status[i].push(false)
    //         col_status[i].push(false)
    //     }
    //   }

    //   oparation_queue = new Array()
    // }

    function generateFloatingPanel(tab, rown, coln) {

    }
    var solution 
    function clear() {
        clearTimeout(t)
        startime  = new Date()
        var grids = $('.grid')
        grids.css('background-color', 'inherit')
        grids.children().text('')
        grids.attr('chosen', false)
        grids.attr('is_static', false)
        seleced_grid = null
        success = false
        $('#floating_panel').remove()
    }

    function highlight_grid(grid) {
        grid.css('background-color', '#996600')
        grid.attr('chosen', true)
        seleced_grid = grid;
    }

    function set_grid_val(tabn, rown, coln, val) {
        var grid = get_grid(tabn, rown, coln)
        // console.log(grid)
        // console.log('val '+val)
        grid.children().text(''+val)
        grid.css('background-color', '#66CCCC')
    }
    function unset_grid_val(tabn, rown, coln, val) {
        var grid = get_grid(tabn, rown, coln)
        grid.children().text('')
        grid.css('background-color', 'inherit')
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
                 row.append('<td class="grid" is_static="false"  col='+k+' idx='+i+j+k+' chosen="false"><span class="grid_text"><span></td>');
            }
        }
    }
    
    
    function buinding_evet() {
        // $(window).keydown(function(event){
        //    console.log(String.fromCharCode(event.which))
        //    if (seleced_grid !== null) {
               
        //        console.log(seleced_grid)
        //        var val = parseInt(String.fromCharCode(event.which))
        //        console.log(val)
        //        if (val >=1 && val <=9) {
                   
        //            var tabn = parseInt(seleced_grid.parent().parent().attr('tabn'))
        //            var row = parseInt(seleced_grid.parent().attr('row'))
        //            var col = parseInt(seleced_grid.attr('col'))
        //            if (check(tabn, row, col, val) === true) {
        //             //    seleced_grid.children().text(val)
        //                set_grid_val(tabn, row, col, val)
        //                console.log([tabn ,row, col, val])
        //                seleced_grid.attr('chosen', false)
        //                seleced_grid = null
        //            } else {
        //                alert('有冲突！')
        //                dishighlight_grid(seleced_grid)
        //            }
        //        }
        //        else {
        //            alert('无效输入！')
        //            dishighlight_grid(seleced_grid)
        //        }
        //     }
        // })
        $('.grid').click(function(){
            // console.log(this)
            var grid = $(this)
            if (grid.attr('is_static') === 'false') {
                    var tabn = parseInt(grid.parent().parent().attr('tabn'))
                    var rown = parseInt(grid.parent().attr('row'))
                    var coln = parseInt(grid.attr('col'))
                    // console.log('row:'+grid.parent().attr('row'))
                    // console.log('col:'+grid.attr('col'))
                if (grid.attr('chosen') === "false") {
                    if (seleced_grid !== null) {
                        // dishighlight_grid(seleced_grid)
                        seleced_grid = null
                        grid.attr('chosen', false)
                    }
                    // highlight_grid(grid)
                    seleced_grid = grid
                    console.log(grid.offset())
                    $('#floating_panel').remove()
                    $('body').append('<div id="floating_panel" ></div>')
                    $('#floating_panel').css('top', grid.offset().top-5).css('left', grid.offset().left-10)
                    var row = parseInt(tabn / 3) * 3 + rown
                    var col = parseInt(tabn % 3) * 3 + coln
                    var candidate = solution.candidate[row][col]
                    candidate = Array.from(candidate)
                    candidate.sort()
                    console.log(candidate)
                    for (var i = 0; i <= candidate.length; i++) {
                        if (i % 3 == 0) {
                            $('#floating_panel').append('<div class="panel_row"></div>')
                        }
                        var float_div = $('#floating_panel').children().last()
                        if (i === candidate.length) {
                            float_div.append('<span class="panel_grid">X</span>')
                        } else {
                            float_div.append('<span class="panel_grid">'+candidate[i]+'</span>')
                        }
                    }
                    $('.panel_grid').click(function() {
                        console.log('panel grid clicked')
                        var tabn = parseInt(seleced_grid.parent().parent().attr('tabn'))
                        var rown = parseInt(seleced_grid.parent().attr('row'))
                        var coln = parseInt(seleced_grid.attr('col'))
                        var val = parseInt(seleced_grid.text())
                        var row = parseInt(tabn/3)*3+rown
                        var col = parseInt(tabn % 3)*3+coln
                        if (val >= 0 && val <= 9) {
                                solution.unclearCandidate(row, col, val)
                                solution.candidate[row][col].add(val)
                            }
                        if ($(this).text() === 'X') {
                            unset_grid_val(tabn, rown, coln, val)
                        } else {
                            
                            val = parseInt($(this).text())
                            set_grid_val(tabn, rown, coln, val)
                            solution.clearCandidate(row, col, val)
                            solution.candidate[row][col].delete(val)
                        }
                        $('#floating_panel').remove()
                        // dishighlight_grid(grid)
                        seleced_grid = null
                        grid.attr('chosen', false)
                    })
                } 
            }
            
        })
        
     
    }
    var t
    function timer() {
        t = setTimeout(function() {
            $('#timer').text('时间：'+parseInt((new Date().getTime()-startime.getTime())/1000)+'s')
            timer()
        }, 1000);
    }

    $('#g_button').click(function () {
        clear()
        timer()
        var dif = parseInt($('input[type="radio"][name="dif"]:checked').val())
        
        solution = new Sudoku(dif)
        solution.generate(displayGrid)
        displayGrid()
    })
    $('#c_button').click(function () {
        clear()
        $('#state').text('status:none')
    })
    $('#a_button').click(()=>{
        clearTimeout(t)
        solution.getAnswer(displayGrid)
        displayGrid()
        
    })
    
    function unbind_evet() {
        $('.grid').unbind('click')
        $(window).unbind('keydown')
    }

  
    function get_grid(tabn, row, col) {
        return $('[idx='+tabn+row+col+']')
    }
    function displayGrid() {
        var zeroCount = 0
        for (var row = 0; row < 9; row ++) {
            for (var col = 0; col < 9; col ++) {
                var tabn = parseInt(row/3)*3 + parseInt(col/3)
                var rown = row - parseInt(row/3)*3
                var coln = col - parseInt(col/3)*3
                set_grid_val(tabn, rown, coln, solution.map[row][col])
                if (solution.map[row][col] === 0) {
                    zeroCount ++
                    // console.log(solution.candidate[row][col])
                    var grid = get_grid(tabn, rown, coln)
                    set_grid_val(tabn, rown, coln, ' ')
                    dishighlight_grid(grid)
                }
                else {
                    var grid = get_grid(tabn, rown, coln)
                    grid.css('background-color', '#50b6b6')
                    grid.attr('is_static', true)
                }
            }
        }
        // console.log('zero: '+zeroCount)  
    }

  
    function check(tabn, rown, coln, val) {
        console.log('checking: '+tabn+' '+rown+' '+coln+' '+val)
        var row = parseInt(tabn/3)*3+rown
        var col = parseInt(tabn % 3)*3+coln
        return solution.check(row, col, val)
    }

   
    buinding_evet()
    
    
    
})

