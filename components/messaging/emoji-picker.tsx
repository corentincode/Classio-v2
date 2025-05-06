"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void
    onClose: () => void
}

const EMOJI_CATEGORIES = [
    {
        name: "Smileys",
        emojis: [
            "😀",
            "😃",
            "😄",
            "😁",
            "😆",
            "😅",
            "😂",
            "🤣",
            "😊",
            "😇",
            "🙂",
            "🙃",
            "😉",
            "😌",
            "😍",
            "🥰",
            "😘",
            "😗",
            "😙",
            "😚",
            "😋",
            "😛",
            "😝",
            "😜",
            "🤪",
            "🤨",
            "🧐",
            "🤓",
            "😎",
            "🤩",
            "🥳",
        ],
    },
    {
        name: "Gestes",
        emojis: [
            "👍",
            "👎",
            "👌",
            "✌️",
            "🤞",
            "🤟",
            "🤘",
            "🤙",
            "👈",
            "👉",
            "👆",
            "👇",
            "☝️",
            "👋",
            "🤚",
            "🖐️",
            "✋",
            "🖖",
            "👏",
            "🙌",
            "👐",
            "🤲",
            "🤝",
            "🙏",
        ],
    },
    {
        name: "Animaux",
        emojis: [
            "🐶",
            "🐱",
            "🐭",
            "🐹",
            "🐰",
            "🦊",
            "🐻",
            "🐼",
            "🐨",
            "🐯",
            "🦁",
            "🐮",
            "🐷",
            "🐸",
            "🐵",
            "🙈",
            "🙉",
            "🙊",
            "🐒",
            "🦆",
            "🦅",
            "🦉",
            "🦇",
            "🐺",
            "🐗",
            "🐴",
        ],
    },
    {
        name: "Nourriture",
        emojis: [
            "🍏",
            "🍎",
            "🍐",
            "🍊",
            "🍋",
            "🍌",
            "🍉",
            "🍇",
            "🍓",
            "🍈",
            "🍒",
            "🍑",
            "🥭",
            "🍍",
            "🥥",
            "🥝",
            "🍅",
            "🍆",
            "🥑",
            "🥦",
            "🥬",
            "🥒",
            "🌶️",
            "🌽",
            "🥕",
            "🧄",
        ],
    },
    {
        name: "Activités",
        emojis: [
            "⚽",
            "🏀",
            "🏈",
            "⚾",
            "🥎",
            "🎾",
            "🏐",
            "🏉",
            "🥏",
            "🎱",
            "🪀",
            "🏓",
            "🏸",
            "🏒",
            "🏑",
            "🥍",
            "🏏",
            "🥅",
            "⛳",
            "🪁",
            "🏹",
            "🎣",
            "🤿",
            "🥊",
            "🥋",
            "🎽",
        ],
    },
    {
        name: "Objets",
        emojis: [
            "📱",
            "💻",
            "⌨️",
            "🖥️",
            "🖨️",
            "🖱️",
            "🖲️",
            "📷",
            "📸",
            "📹",
            "📽️",
            "🎞️",
            "📞",
            "☎️",
            "📟",
            "📠",
            "📺",
            "📻",
            "🎙️",
            "🎚️",
            "🎛️",
            "🧭",
            "⏱️",
            "⏲️",
            "⏰",
            "🕰️",
        ],
    },
]

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
    const [activeCategory, setActiveCategory] = useState(0)

    return (
        <div className="bg-white rounded-lg shadow-lg border overflow-hidden w-64">
            <div className="flex border-b overflow-x-auto p-1 gap-1">
                {EMOJI_CATEGORIES.map((category, index) => (
                    <Button
                        key={category.name}
                        variant={activeCategory === index ? "default" : "ghost"}
                        size="sm"
                        className="text-xs whitespace-nowrap"
                        onClick={() => setActiveCategory(index)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            <div className="p-2 h-48 overflow-y-auto">
                <div className="grid grid-cols-7 gap-1">
                    {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => onEmojiSelect(emoji)}
                            className="text-xl p-1 hover:bg-gray-100 rounded cursor-pointer"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
