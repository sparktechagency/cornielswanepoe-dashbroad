// components/PageEditor.tsx
import { Clock, Edit3, Eye, Save, FileText, CheckCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useRef } from "react";

interface Page {
    title: string;
    slug: string;
    lastUpdated: string;
    content: string;
    status: "published" | "draft";
}

interface PageEditorProps {
    currentPage: Page | null;
    editMode: boolean;
    isSaving: boolean;
    onToggleEditMode: () => void;
    onSave: () => void;
    onContentChange: (value: string) => void;
}

export const PageEditor = ({
    currentPage,
    editMode,
    isSaving,
    onToggleEditMode,
    onSave,
    onContentChange,
}: PageEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Set content only when switching into edit mode — never on every keystroke
    useEffect(() => {
        if (editMode && editorRef.current) {
            editorRef.current.innerHTML = currentPage?.content || "";
        }
    }, [editMode]);

    return (
        <div className="lg:col-span-3">
            <div className="bg-[#111111] border border-primary/20 rounded-lg">
                {/* Editor Header */}
                <div className="border-b border-primary/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-serif text-white mb-1">{currentPage?.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>{currentPage?.slug}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Last updated:{" "}
                                    {new Date(currentPage?.lastUpdated || "").toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onToggleEditMode}
                                className="flex items-center text-black! gap-2"
                            >
                                {editMode ? (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="w-4 h-4" />
                                        Edit
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={()=>onSave()}
                                disabled={isSaving || !editMode}
                                className="flex items-center gap-2"
                                size="sm"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>

                    {/* Editor Toolbar */}
                    {editMode && (
                        <div className="flex items-center gap-2 p-3 bg-[#1A1A1A] rounded-lg border border-primary/10">
                            {[
                                { label: <strong>B</strong>, command: "bold" },
                                { label: <em>I</em>, command: "italic" },
                                { label: "H1", command: "formatBlock", value: "h1" },
                                { label: "H2", command: "formatBlock", value: "h2" },
                            ].map((btn, i) => (
                                <button
                                    key={i}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        document.execCommand(btn.command, false, btn.value);
                                    }}
                                    className="px-3 py-1 bg-[#0A0A0A] rounded text-gray-300 hover:text-white text-sm"
                                >
                                    {btn.label}
                                </button>
                            ))}
                            <div className="w-px h-6 bg-primary/20 mx-2" />
                            {["Link", "Image", "List"].map((label) => (
                                <button
                                    key={label}
                                    className="px-3 py-1 bg-[#0A0A0A] rounded text-gray-300 hover:text-white text-sm"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-6">
                    {editMode ? (
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => onContentChange(e.currentTarget.innerHTML)}
                            className="w-full min-h-[600px] bg-[#1A1A1A] border border-primary/20 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-primary"
                        />
                    ) : (
                        <div
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: currentPage?.content || "" }}
                            style={{ color: "#e5e5e5" }}
                        />
                    )}
                </div>

                {/* Editor Footer */}
                <div className="border-t border-primary/20 p-4 bg-[#0A0A0A]">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-400">
                            <span>{currentPage?.content?.length} characters</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                HTML Editor
                            </span>
                        </div>
                        <span
                            className={`flex items-center gap-1 ${
                                currentPage?.status === "published"
                                    ? "text-green-400"
                                    : "text-orange-400"
                            }`}
                        >
                            {currentPage?.status === "published" ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Published
                                </>
                            ) : (
                                <>
                                    <Clock className="w-4 h-4" />
                                    Draft
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
};