import { VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { For, createSignal } from "solid-js";
import whitePawnImage from "./assets/pieces/wP.svg";
import whiteKnightImage from "./assets/pieces/wP.svg";
import whiteBishopImage from "./assets/pieces/wP.svg";
import whiteRookImage from "./assets/pieces/wP.svg";
import whiteQueenImage from "./assets/pieces/wP.svg";
import whiteKingImage from "./assets/pieces/wP.svg";
import blackPawnImage from "./assets/pieces/wP.svg";
import blackKnightImage from "./assets/pieces/wP.svg";
import blackBishopImage from "./assets/pieces/wP.svg";
import blackRookImage from "./assets/pieces/wP.svg";
import blackQueenImage from "./assets/pieces/wP.svg";
import blackKingImage from "./assets/pieces/wP.svg";

enum Kind {
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING,
}

enum Color {
    WHITE,
    BLACK,
}

type Piece = {
    kind: Kind;
    color: Color;
    rank: number;
    file: number;
};

function seedPieces(): Piece[] {
    const board: Piece[] = [];
    for (let i = 0; i < 64; i++) {
        board.push({
            kind: Kind.PAWN,
            color: Color.WHITE,
            rank: 0,
            file: 0,
        });
    }
    return board;
}

const App = () => {
    const [pieces, _setPieces] = createSignal<Piece[]>(seedPieces());
    // const [selected, setSelected] = createSignal<number | null>(null);

    return (
        <main class="w-full p-12 flex justify-center">
            <div class="relative">
                <Board class="absolute" />
                <div class="top-0 left-0 absolute grid grid-cols-8 gap-0 w-max h-max rounded-lg overflow-hidden">
                    <For each={pieces()}>
                        {(piece, _i) => {
                            return <VisualPiece piece={piece} />;
                        }}
                    </For>
                </div>
            </div>
        </main>
    );
};

const Board = (props: { class: string }) => {
    return (
        <div class={twMerge(["grid grid-cols-8 w-max"], props.class)}>
            <For each={Array.from({ length: 64 }, () => 0)}>
                {(_, i) => {
                    let offset = Math.floor(i() / 8) % 2 == 0 ? 0 : 1;
                    return (
                        <Square
                            color={(i() + offset) % 2 == 0 ? "light" : "dark"}
                        />
                    );
                }}
            </For>
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

interface PieceProps {
    piece: Piece;
}

const VisualPiece = (props: PieceProps) => {
    const imagePath = getPieceImage(props.piece);

    if (!imagePath) {
        throw new Error(`failed to find image for piece ${props.piece}`);
    }

    return (
        <button
            class="w-20 bg-slate-200 aspect-square absolute"
            style={{
                top: (props.piece.rank * 80).toString() + "px",
                left: (props.piece.file * 80).toString() + "px",
            }}
        >
            <img src={imagePath} alt="piece" width="80px" />
        </button>
    );
};

function getPieceImage(piece: Piece): string | null {
    switch (piece.kind) {
        case Kind.PAWN:
            return piece.color === Color.WHITE
                ? whitePawnImage
                : blackPawnImage;
            break;
        case Kind.KNIGHT:
            return piece.color === Color.WHITE
                ? whiteKnightImage
                : blackKnightImage;
            break;
        case Kind.BISHOP:
            return piece.color === Color.WHITE
                ? whiteBishopImage
                : blackBishopImage;
            break;
        case Kind.ROOK:
            return piece.color === Color.WHITE
                ? whiteRookImage
                : blackRookImage;
            break;
        case Kind.QUEEN:
            return piece.color === Color.WHITE
                ? whiteQueenImage
                : blackQueenImage;
            break;
        case Kind.KING:
            return piece.color === Color.WHITE
                ? whiteKingImage
                : blackKingImage;
            break;

        default:
            return null;
            break;
    }
}

export default App;
