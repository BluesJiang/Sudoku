class Sudoku {

    constructor (difficulty) {
        this.map = []
        this.candidate = []
        this.difficulty = 0
        this.unsetCount = 81
        this.map = []
        this.ansMap = []
        this.candidate = []
        this.unsetCount = 81
        this.emptyGrid = []
        this.solveCount = 0
        this.emptyGridCount = 0
        this.setDifficulty(difficulty)
        this.unfilterStack = []
        this.filterStackPonter = []
    }
    setDifficulty(difficulty) {
        switch (difficulty) {
            case 0 :
                this.emptyGridCount = 40
                break
            case 1 :
                this.emptyGridCount = 60
                break
            case 2 :
                this.emptyGridCount = 70
            default:
                break
        }
    }

    init() {
        this.unfilterStack = []
        this.map = []
        this.ansMap = []
        this.emptyGrid = []
        this.candidate = []
        this.unsetCount = 81
        for (var i = 0; i < 9; i++) {
            this.candidate.push([])
            for (var j = 0; j < 9; j++) {
                this.candidate[i].push(new Set())
                for (var val = 1; val <= 9; val++) {
                    this.candidate[i][j].add(val)
                }
            }
            
        }
        for (var i = 0; i < 9; i++) {
            this.map.push([])
            this.ansMap.push([])
            for (var j = 0; j < 9; j++) {
                this.map[i].push(0)
                this.ansMap[i].push(0)
            }
        }
    }

    doTheGridThing(row, col, block) {
        // var val = this.candidate[row][col].only()
        for (var i = 0; i < 9; i++) {
            // this.candidate[row][i].delete(val)
            if (i === col) continue
            if(block(row, i) === true) {
                return
            } 
        }
        for (var i = 0; i < 9; i++) {
            // this.candidate[i][col].delete(val)
            if (i === row) continue
            if(block(i, col) === true) {
                return
            } 
        }
        var trow = parseInt(row/3)*3
        var tcol = parseInt(col/3)*3
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (trow+i !== row || tcol+j !== col) {
                    // this.candidate[trow+i][tcol+j].delete(val)
                    if(block(trow+i, tcol+j) === true) {
                        return
                    } 
                }
            }
        }
    }
    getIntRamdom(low=0, high=9) {
        return parseInt(Math.random()*1000000000)%(high-low)+low
    }

    doTheEmptyGridThing(row ,col, block) {
        for (var i = 0; i < this.emptyGrid.length; i++) {
            if (this.emptyGrid[i][0] === row && this.emptyGrid[i][1] === col) {
                continue
            }
            if (this.emptyGrid[i][0] === row) {
                var grid = this.emptyGrid[i]
                block(grid[0], grid[1])
                continue
            }
            if (this.emptyGrid[i][1] === col) {
                var grid = this.emptyGrid[i]
                block(grid[0], grid[1])
                continue
            }
            var grid = this.emptyGrid[i]
            var targettabn = parseInt(row/3)*3+parseInt(col/3)
            var destabn = parseInt(grid[0]/3)*3+parseInt(grid[1]/3)
            if (targettabn === destabn) {
                block(grid[0], grid[1])
                continue
            }
        }
    }
    unclearEmptyCandidate(row, col, val) {
        this.doTheEmptyGridThing(row, col, (trow, tcol) =>{
            this.candidate[trow][tcol].add(val)
        })
    }
    clearEmptyCandidate(row, col, val) {
        this.doTheEmptyGridThing(row, col, (trow, tcol) =>{
            this.candidate[trow][tcol].delete(val)
        })
    }

    unclearCandidate(row, col, val) {
        this.doTheGridThing(row, col, (trow, tcol) => {
            this.candidate[trow][tcol].add(val)
            // return false
        })
    }
    clearCandidate(row, col, val) {
        this.doTheGridThing(row, col, (trow, tcol) => {
            this.candidate[trow][tcol].delete(val)
            // return false
        })
    }

    resetCandidate(f) {
        for (var i = 0; i < this.emptyGrid.length; i++) {
            var grid = this.emptyGrid[i]
            var row = grid[0]
            var col = grid[1]
            this.candidate[row][col].clear()
            for (var val = 1; val <=9; val++) {
                this.candidate[row][col].add(val)
            }
            this.map[row][col] = 0
            this.doTheGridThing(row, col, (trow, tcol) => {
                if (this.checkEmpty(trow, tcol) === false) {
                    this.candidate[row][col].delete(this.map[trow][tcol])
                }
            })
        }
    }

    getLonelyCandidate(row, col) {
        for (var val of this.candidate[row][col]) {
            var flag = true
            this.doTheGridThing(row, col, (trow, tcol) => {
                if (this.candidate[trow][tcol].has(val) === true) {
                    flag = false
                    return true
                } 
                // else {
                //     return false
                // }
            })
            if (flag === true) {
                this.unfilterStack.push([row, col, val])
                this.clearCandidate(row, col, val)
                return val
            }
        }
        return false
    }

    check(row, col, val) {
        // console.log('checking '+row+' '+col+' '+' '+val)
        var flag = true
        this.doTheGridThing(row, col, (trow, tcol) => {
            if (this.map[trow][tcol] === val) {
                flag = false
                return true
            }
        })
        return flag
    }
    

    filterFunction(f) {

        while (this.unsetCount >= 0) {
            var pointer = 0
            var origin = this.unsetCount
            for (var i = 0; i < this.emptyGrid.length; i++) {
                var row = this.emptyGrid[i][0]
                var col = this.emptyGrid[i][1]
                if (this.candidate[row][col].size === 1) {
                    var val
                    for (var x of this.candidate[row][col]) {
                        val = x
                        break   
                    }
                    this.unfilterStack.push([row, col, val])
                    pointer++
                    this.clearCandidate(row, col, val)
                    this.candidate[row][col].delete(val)
                    this.map[row][col] = val
                    this.unsetCount --
                    

                }
            }
            for (var i = 0; i < this.emptyGrid.length; i++) {
                var row = this.emptyGrid[i][0]
                var col = this.emptyGrid[i][1] 
                if (this.candidate[row][col].size !== 0) {
                    var lonelyCandidate = this.getLonelyCandidate(row, col)
                    if (lonelyCandidate !== false) {
                        this.map[row][col] = lonelyCandidate;
                        this.candidate[row][col].delete(val)
                        pointer++
                        this.unsetCount --
                    }
                }
            }
        
            // f()
            if (origin === this.unsetCount) {
                this.filterStackPonter.push(pointer)
                break
            }
            // console.log("loopping")
        }
        // this.solveSudoku(f, 0)
        // console.log(this.map)
        
    
    }

    unfilter() {
        var pointer = this.filterStackPonter.pop()
        while (pointer > 0) {
            var op = unfilterStack.pop()
            this.map[op[0]][po[1]] = 0
            this.candidate[op[0]][po[1]].add(po[2])
            this.unclearCandidate(po[0], po[1], po[2])
            this.unsetCount++
            pointer--
        }
    }

    getAnswer(f) {
        // this.resetCandidate()
        // this.wantToGetAnwer = true
        // this.solveCount = 0
        // this.unsetCount = this.emptyGrid.length
        // this.solveSudoku(f, 0)
        for (var row = 0; row < 9; row ++) {
            for (var col = 0; col < 9; col++) {
                this.map[row][col] = this.ansMap[row][col]
            }
        }
        
        
    }

    checkFull() {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (this.map[i][j] === 0) {
                    return false
                }
            }
        }
        return true
    }

    solveSudoku(f, empty_idx) {
        
        if (empty_idx >= this.emptyGrid.length) {
            if (this.checkFull()) {
                this.solveCount ++
            }
            
            // console.log('solove:'+this.solveCount)
            return
        }
        var grid = this.emptyGrid[empty_idx]
        var row = grid[0]
        var col = grid[1]
        if (this.candidate[row][col].size === 0) {
            this.solveSudoku(f, empty_idx+1)
        }
        for (var val of this.candidate[row][col]) {
            if (this.check(row, col, val) === true) {
                this.map[row][col] = val
                this.clearEmptyCandidate(row, col, val)
                this.unsetCount--
                // f()
                this.filterFunction(f)
                f()
                if (this.checkFull() === true) {
                    return
                }
                this.solveSudoku(f,empty_idx+1)

                if (this.solveCount >=1 && this.wantToGetAnwer === true ){
                    return
                }
                if (this.solveCount >= 2) {
                    return
                }
                this.unfilter()
                this.map[row][col] = 0
                this.unclearEmptyCandidate(row, col, val)
                this.unsetCount++
                f()
                // f()
                
            }
        }
    }



    checkEmpty(row, col) {
        for (var i = 0; i < this.emptyGrid.length; i++) {
            if (this.emptyGrid[i][0] === row && this.emptyGrid[i][1] === col) {
                return true
            }
        }
        return false
    }

    takeGrid(f) {
        this.emptyGrid = []
        while (this.emptyGrid.length < this.emptyGridCount) {
            var row, col, val
            do {
                row = parseInt(Math.random()*10)%9
                col = parseInt(Math.random()*10)%9
            } while(this.checkEmpty(row, col))
            val = this.map[row][col]
            this.solveCount = 0
            this.unclearEmptyCandidate(row, col, val)
            this.candidate[row][col].add(val)
            this.emptyGrid.push([row, col])
            this.map[row][col] = 0

            // f()
            
            
            // this.filterFunction(f)
            // this.solveSudoku(f,0)
            // f()
            if (this.solveCount >= 2) {
                this.emptyGrid.pop()
                this.clearEmptyCandidate(row, col, val)
                this.map[row][col] = val
                this.candidate[row][col].clear()
                // f()
            }
            this.resetCandidate(f)   
            // f()
        }
    }

    

    generate (f) {
        while (1) {
            this.init()
            this.unsetCount = 81
            for (var row = 0; row < 9; row ++) {
                for (var col = 0; col < 9; col++) {
                    // console.log(this.candidate[row][col])
                    // console.log(typeof(this.candidate[row][col].size))
                    var i = parseInt(Math.random()*91) % (this.candidate[row][col].size)
                    var val = -1;
                    for (var x of this.candidate[row][col]) {
                        if (i === 0) {
                            val = x
                            break
                        }
                        i --
                    }
                    if (val > 0) {
                        this.map[row][col] = val
                        this.clearCandidate(row, col, val)
                        this.candidate[row][col].clear()
                        this.unsetCount--
                    }
                    

                }
            } 
            if (this.unsetCount === 0) {   
                break
            }
            
        }
        for (var row = 0; row < 9; row ++) {
            for (var col = 0; col < 9; col++) {
                this.ansMap[row][col] = this.map[row][col]
            }
        }
        this.takeGrid(f)
        // f()
        
    }

}