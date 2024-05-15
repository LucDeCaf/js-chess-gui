import { VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { For, type JSX, createSignal, createEffect, Accessor } from "solid-js";
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

function rank(index: number): number {
    return 7 - Math.floor(index / 8);
}

function file(index: number): number {
    return index % 8;
}

function seedPieces(): Piece[] {
    const board: Piece[] = [];
    for (let i = 0; i < 10; i++) {
        board.push({
            kind: Kind.PAWN,
            color: Color.WHITE,
            rank: rank(i),
            file: file(i),
        });
    }
    return board;
}

const App = () => {
    const [pieces, setPieces] = createSignal<Piece[]>(seedPieces());
    const [selected, setSelected] = createSignal<number | null>(null);
    const [currentTurn, setCurrentTurn] = createSignal<Color>(Color.WHITE);

    function handlePieceClicked(clickedIndex: number) {
        console.log("piece clicked");
        const selectedIndex = selected();

        // Handle clicking piece for the first time
        if (!selectedIndex) {
            if (pieces()[clickedIndex].color === currentTurn()) {
                setSelected(clickedIndex);
            }
            return;
        }

        // Handle deselecting pieces
        if (selectedIndex === clickedIndex) {
            setSelected(null);
            return;
        }

        // Handle clicking on a piece with another piece selected
        if (selectedIndex) {
            // Prevent capturing your own piece - instead select it
            if (pieces()[clickedIndex].color === currentTurn()) {
                setSelected(clickedIndex);
                return;
            }

            // Move piece and capture enemy piece
            setPieces((prev) => {
                const newPieces = [...prev];

                const movedPiece = newPieces[selectedIndex];
                const capturedPiece = newPieces[clickedIndex];

                movedPiece.rank = capturedPiece.rank;
                movedPiece.file = capturedPiece.file;

                newPieces.splice(newPieces.indexOf(capturedPiece), 1);

                return newPieces;
            });

            setSelected(null);

            setCurrentTurn(
                currentTurn() === Color.WHITE ? Color.BLACK : Color.WHITE
            );
        }
    }

    function handleSquareClicked(index: number) {
        const selectedIndex = selected();

        if (!selectedIndex) {
            return;
        }

        const newRank = rank(index);
        const newFile = file(index);

        setPieces((prev) => {
            const updated = [...prev];

            updated[selectedIndex].rank = newRank;
            updated[selectedIndex].file = newFile;

            return updated;
        });

        setSelected(null);
    }

    return (
        <main class="w-full min-h-screen p-12 flex justify-center">
            <div class="relative w-[40rem] h-[40rem] flex justify-center">
                <Board class="absolute" onclick={handleSquareClicked} />
                <For each={pieces()}>
                    {(_piece, i) => {
                        return (
                            <VisualPiece
                                piece={() => pieces()[i()]}
                                onclick={() => handlePieceClicked(i())}
                            />
                        );
                    }}
                </For>
            </div>
        </main>
    );
};

interface ButtonProps {
    class: string;
    onclick: (index: number) => any;
}

const Board = (props: ButtonProps) => {
    return (
        <div
            class={twMerge(
                "w-[40rem] h-[40rem] relative overflow-hidden rounded-lg",
                props.class
            )}
        >
            <For each={Array.from({ length: 64 }, () => 0)}>
                {(_, i) => {
                    const offset = Math.floor(i() / 8) % 2 === 0 ? 1 : 0;
                    return (
                        <Square
                            color={(i() + offset) % 2 === 0 ? "light" : "dark"}
                            onclick={() => props.onclick(i())}
                            style={{
                                top: (rank(i()) * 80).toString() + "px",
                                left: (file(i()) * 80).toString() + "px",
                            }}
                        />
                    );
                }}
            </For>
        </div>
    );
};

const square = cva(
    ["aspect-square", "w-20", "cursor-default", "m-0", "p-0", "absolute"],
    {
        variants: {
            color: {
                light: ["bg-orange-300"],
                dark: ["bg-amber-800"],
            },
        },
    }
);

interface SquareProps extends VariantProps<typeof square> {
    onclick: () => any;
    style: JSX.HTMLAttributes<HTMLButtonElement>["style"] | undefined;
}

const Square = (props: SquareProps) => {
    return (
        <button
            class={square({ color: props.color })}
            onclick={props.onclick}
            style={props.style}
        />
    );
};

interface PieceProps {
    piece: Accessor<Piece>;
    onclick: () => any;
}

const VisualPiece = (props: PieceProps) => {
    const imagePath = getPieceImage(props.piece());

    if (!imagePath) {
        throw new Error(`failed to find image for piece ${props.piece()}`);
    }

    return (
        <button
            class="w-20 h-20 z-30 absolute"
            style={{
                top: (props.piece().rank * 80).toString() + "px",
                left: (props.piece().file * 80).toString() + "px",
            }}
            onclick={() => props.onclick()}
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
