import { VariantProps, cva } from "class-variance-authority";
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
};

function initialisePieces(): (Piece | null)[] {
    const board = [];
    for (let i = 0; i < 64; i++) {
        board.push({ kind: Kind.PAWN, color: Color.WHITE });
    }
    return board;
}

const App = () => {
    const [pieces, _setPieces] = createSignal<(Piece | null)[]>(
        initialisePieces()
    );
    // const [selected, setSelected] = createSignal<number | null>(null);

    return (
        <div class="w-full p-12 flex justify-center">
            {/* Board */}
            <div class="grid grid-cols-8 gap-0 w-max h-max rounded-lg overflow-hidden">
                <For each={Array.from({ length: 64 }, () => 0)}>
                    {(_, i) => {
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
            {/* Pieces */}
            <For each={pieces()}>
                {(piece, _i) => {
                    if (piece) {
                        return <VisualPiece piece={piece} />;
                    }
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
        <div class="w-40 aspect-square absolute">
            <img src={imagePath} alt="piece" />
        </div>
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
                : blackBishopImage;
            break;
        case Kind.QUEEN:
            return piece.color === Color.WHITE
                ? whiteQueenImage
                : blackBishopImage;
            break;
        case Kind.KING:
            return piece.color === Color.WHITE
                ? whiteKingImage
                : blackBishopImage;
            break;

        default:
            return null;
            break;
    }
}

export default App;
