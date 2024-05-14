import { VariantProps, cva } from "class-variance-authority";
import { For, createSignal } from "solid-js";

enum Piece {
    NONE,
    WHITE_PAWN,
    WHITE_KNIGHT,
    WHITE_BISHOP,
    WHITE_ROOK,
    WHITE_QUEEN,
    WHITE_KING,
    BLACK_PAWN,
    BLACK_KNIGHT,
    BLACK_BISHOP,
    BLACK_ROOK,
    BLACK_QUEEN,
    BLACK_KING,
}

function createBoard(): Piece[] {
    const board = [];
    for (let i = 0; i < 64; i++) {
        board.push(Piece.NONE);
    }
    return board;
}

const App = () => {
    const [board, _setBoard] = createSignal<Piece[]>(createBoard());
    // const [selected, setSelected] = createSignal<number | null>(null);

    return (
        <div class="w-full h-screen flex justify-center items-center">
            <div class="grid grid-cols-8 gap-0 w-max h-max rounded-lg overflow-hidden">
                <For each={board()}>
                    {(_board, i) => {
                        let offset = Math.floor(i() / 8) % 2 == 0 ? 0 : 1;
                        return (
                            <Square
                                color={
                                    (i() + offset) % 2 == 0 ? "light" : "dark"
                                }
                            />
                        );
                    }}
                </For>
            </div>
        </div>
    );
};

const square = cva(["aspect-square", "w-20"], {
    variants: {
        color: {
            light: ["bg-orange-300"],
            dark: ["bg-amber-800"],
        },
    },
});

interface SquareProps extends VariantProps<typeof square> {}

const Square = (props: SquareProps) => {
    return <div class={square({ color: props.color })}></div>;
};

export default App;
