"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Variable } from "types/variables";
import useLocalStorage from "@/hooks/useLocalStorage";

const VariablesContainer = () => {
  const variables = useTranslations("Variables");
  const [items, setItems] = useLocalStorage("variables", []);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newValue.trim()) return;

    const duplicate = items.some(
      (item: Variable) =>
        item.name.toLowerCase() === newName.trim().toLowerCase()
    );

    if (duplicate) {
      return;
    }

    const updated = [
      ...items,
      { name: newName.trim(), value: newValue.trim() },
    ];
    setItems(updated);
    setNewName("");
    setNewValue("");
  };

  const handleRemove = (name: string) => {
    const updated = items.filter((item: Variable) => item.name !== name);
    setItems(updated);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-10 w-full flex flex-col">
      <h3 className="text-center text-2xl font-bold mb-5">
        {variables("title")}
      </h3>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1"
          type="text"
          placeholder={variables("namePlaceholder")}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          className="flex-1 border px-2 py-1"
          type="text"
          placeholder={variables("valuePlaceholder")}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim() || !newValue.trim()}
          className="bg-indigo-600 text-white px-4 py-1 rounded hover:cursor-pointer hover:bg-indigo-500 disabled:opacity-50 active:scale-95"
        >
          &#43;
        </button>
      </div>
      <div className="text-red-500 text-sm">
        {items.some(
          (item: Variable) =>
            item.name.toLowerCase() === newName.trim().toLowerCase()
        ) && variables("duplicateError")}
      </div>

      <div className="flex flex-col border border-gray-300">
        <div className="flex justify-between bg-gray-200 font-semibold">
          <div className="flex-1 pl-4 py-1">{variables("name")}</div>
          <div className="flex-1 border-l border-gray-300 pl-4 py-1">
            {variables("value")}
          </div>
          <div className="w-10 border-l border-gray-300 pl-4 py-1"></div>
        </div>
        {items.map((item: Variable) => (
          <div
            className="flex justify-between border-t border-gray-300"
            key={item.name}
          >
            <div className="flex-1 pl-4 py-1">{item.name}</div>
            <div className="flex-1 border-l border-gray-300 pl-4 py-1">
              {item.value}
            </div>
            <div className="border-l w-10 border-gray-300 py-1 flex justify-center">
              <button
                onClick={() => handleRemove(item.name)}
                className="text-xl text-red-400 cursor-pointer"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            {variables("empty")}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariablesContainer;
