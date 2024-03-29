import { useState } from "react";
import { FaFire, FaPlus, FaTrash } from "react-icons/fa6";
import { motion } from "framer-motion";
import axios from "axios";
import { Empty, Tag } from "antd";
import { Button } from "@chakra-ui/react";
import InfoModal from "../common/InfoModal";
import { IoMdEye } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { Link } from "react-router-dom";

export const CustomKanban = ({ data }) => {
    return (
        <div className="w-full">
            <Board data={data} />
        </div>
    );
};

const Board = ({ data }) => {
    const [cards, setCards] = useState(data);

    return (
        <div className="grid grid-cols-3 w-full h-full gap-3">
            {statusData.map((item) => (
                <Column
                    key={`col-${item.column}`}
                    title={item.name}
                    column={item.column}
                    headingColor={item.headingColor}
                    cards={cards}
                    setCards={setCards}
                />
            ))}
            {/* <BurnBarrel setCards={setCards} /> */}
        </div>
    );
};

const statusData = [
    { id: 0, name: "Raw", column: "raw", headingColor: "text-red-400" },
    { id: 1, name: "In progress", column: "in-progress", headingColor: "text-green-400" },
    { id: 3, name: "Lost", column: "lost", headingColor: "text-blue-400" },
    { id: 2, name: "Converted", column: "converted", headingColor: "text-purple-400" },
]

const Column = ({ title, headingColor, cards, column, setCards, data }) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("cardId", card?._id);
    };

    const handleStatusChange = async (leadId, statusNo) => {
        try {
            await axios.get(
                `${import.meta.env.VITE_API_BASE}/api/admin/updateLeadStatus/${leadId}/${statusNo}`
            );
            // Fetch data again after updating status
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE}/api/admin/getAllLeads`
            );
            setCards(response.data);
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error.response.data.message);
        }
    };

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData("cardId");

        setActive(false);
        clearHighlights();

        const selectedStatus = statusData.filter((e) => e.column?.toLowerCase() === column?.toLowerCase())[0];
        const selectedCard = cards.filter((e) => e._id === cardId)[0];
        // console.log(selectedCard?.lead_id)
        console.log(selectedStatus);

        handleStatusChange(selectedCard?.lead_id, selectedStatus.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);

        setActive(true);
    };

    const clearHighlights = (els) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            i.style.opacity = "0";
        });
    };

    const highlightIndicator = (e) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(e, indicators);

        el.element.style.opacity = "1";
    };

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();

                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    };

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredCards = cards.filter((c) => c.status.toLowerCase() === column.toLowerCase());

    return (
        <div className={`w-full bg-gray-100 rounded-md p-4 min-h-[250px] h-full ${column === "converted" ? "col-span-3" : "col-span-3 md:col-span-1"}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-[calc(100%-40px)] overflow-x-hidden overflow-y-hidden w-full transition-colors
                    ${filteredCards.length > 0 && "overflow-y-scroll"} 
                    ${active ? "bg-gray-200" : "bg-neutral-800/0"
                    }`}
            >
                {filteredCards.length === 0 ?
                    <Empty
                        className="h-full flex flex-col items-center justify-center"
                        description={
                            <h3 className="font-semibold text-gray-500 text-md capitalize">No leads {column}</h3>
                        }
                    >
                    </Empty>
                    : (
                        <div className={`${column === "converted" ? "grid gap-3 grid-cols-3 itesta" : ""}`}>
                            {filteredCards.map((c) => (
                                <Card key={c._id} card={c} column={column} handleDragStart={handleDragStart} />
                            ))}
                        </div>
                    )}
                <DropIndicator beforeId={null} column={column} />
                {/* <AddCard column={column} setCards={setCards} /> */}
            </div>
        </div>
    );
};

import { useDispatch } from "react-redux";
import { setLeadId } from "../../store/slice/LeadSlice";

const Card = ({ card, column, handleDragStart }) => {
    const [selectedLead, setSelectedLead] = useState(null);
    const dispatch = useDispatch();

    const handleUpdateLead = (leadId) => {
        dispatch(setLeadId(leadId));
    }


    return (
        <>
            <DropIndicator beforeId={card?._id} column={column} />
            <motion.div
                layout
                layoutId={card?._id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { ...card })}
                className={`cursor-grab rounded border p-3 active:cursor-grabbing bg-white`}
            // ${column === "raw" ? "bg-red-400" : column === "in-progress" ? "bg-green-400" : column === "converted" ? "bg-purple-400" : "bg-blue-400" }
            >
                <div className="flex gap-2 items-center justify-between">
                    <h2 className="text-lg capitalize">{card?.title && card?.title} {card?.clientName}</h2>
                    <div className="flex gap-2">
                    <Link to="/UpdateLead">
                        <Button variant={"outline"} colorScheme="red" p={1} size={"sm"} onClick={() => handleUpdateLead(card?.lead_id)}><MdModeEditOutline size={18} /></Button>
                        </Link>
                        <Button bg="purple.500" _hover={{ bg: "purple.400" }} color={"purple.50"} p={2} size={"sm"} onClick={() => setSelectedLead(card)}><IoMdEye size={18} /></Button>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-4">
                    {card?.country && <Tag color="orange">Location: {card?.city && card?.city}, {card?.country}</Tag>}
                    {card?.brandName && <Tag color="green">Brand: {card?.brandName}</Tag>}
                    {card?.companyName && <Tag color="gold">Company: {card?.companyName}</Tag>}
                    {card?.enquiryDate && <Tag color="purple">Enq date: {card?.enquiryDate}</Tag>}
                    {card?.website && <Tag color="cyan">{card?.website}</Tag>}
                </div>
            </motion.div>
            <InfoModal
                modalFor="lead"
                data={selectedLead}
                onClose={() => setSelectedLead(null)}
                isOpen={selectedLead !== null}
            />
        </>
    );
};

const DropIndicator = ({ beforeId, column }) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
        />
    );
};

const BurnBarrel = ({ setCards }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData("cardId");

        setCards((pv) => pv.filter((c) => c.id !== cardId));

        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active
                ? "border-red-800 bg-red-800/20 text-red-500"
                : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
                }`}
        >
            {active ? <FaFire className="animate-bounce" /> : <FaTrash />}
        </div>
    );
};

const AddCard = ({ column, setCards }) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
        };

        setCards((pv) => [...pv, newCard]);

        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit}>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setAdding(false)}
                            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
                        >
                            <span>Add</span>
                            <FaPlus />
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 transition-colors"
                >
                    <span>Add card</span>
                    <FaPlus />
                </motion.button>
            )}
        </>
    );
};

const DEFAULT_CARDS = [
    // BACKLOG
    { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
    { title: "SOX compliance checklist", id: "2", column: "backlog" },
    { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
    { title: "Document Notifications service", id: "4", column: "backlog" },
    // TODO
    {
        title: "Research DB options for new microservice",
        id: "5",
        column: "todo",
    },
    { title: "Postmortem for outage", id: "6", column: "todo" },
    { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

    // DOING
    {
        title: "Refactor context providers to use Zustand",
        id: "8",
        column: "doing",
    },
    { title: "Add logging to daily CRON", id: "9", column: "doing" },
    // DONE
    {
        title: "Set up DD dashboards for Lambda listener",
        id: "10",
        column: "done",
    },
];