import random
import json

def is_valid(board, row, col, num):
    for i in range(9):
        if board[row][i] == num or board[i][col] == num:
            return False
        box_row = 3 * (row // 3) + i // 3
        box_col = 3 * (col // 3) + i % 3
        if board[box_row][box_col] == num:
            return False
    return True

def solve(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in random.sample(range(1, 10), 9):
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve(board):
                            return True
                        board[row][col] = 0
                return False
    return True

def generate_complete_board():
    board = [[0] * 9 for _ in range(9)]
    solve(board)
    return board

def remove_numbers(board, holes=40):
    puzzle = [row[:] for row in board]
    count = 0
    while count < holes:
        row, col = random.randint(0, 8), random.randint(0, 8)
        if puzzle[row][col] != "":
            puzzle[row][col] = ""
            count += 1
    return puzzle

def generate_puzzles(count=5, difficulty='easy'):
    puzzles = []
    hole_map = {
        'easy': 35,
        'hard': 55
    }
    for _ in range(count):
        full = generate_complete_board()
        problem = remove_numbers(full, hole_map[difficulty])
        puzzles.append({
            'difficulty': difficulty,
            'problem': problem,
            'solution': full
        })
    return puzzles

def save_to_json(puzzles, filename='sudoku-data-generated.json'):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(puzzles, f, indent=2)

if __name__ == '__main__':
    easy_puzzles = generate_puzzles(count=5, difficulty='easy')
    hard_puzzles = generate_puzzles(count=5, difficulty='hard')
    save_to_json(easy_puzzles + hard_puzzles)
    print("🧩 sudoku-data-generated.json Create")
