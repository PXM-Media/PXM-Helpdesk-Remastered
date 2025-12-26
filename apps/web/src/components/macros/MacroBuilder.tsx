"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Action {
    action: string;
    value: string;
}

interface MacroBuilderProps {
    initialActions?: Action[];
    onChange: (actions: Action[]) => void;
}

const ACTION_TYPES = [
    { value: "set_status", label: "Set Status" },
    { value: "set_priority", label: "Set Priority" },
    { value: "assign_user", label: "Assign User" },
    { value: "comment", label: "Add Public Comment" },
    { value: "comment_internal", label: "Add Internal Note" },
];

const TICKET_STATUSES = ["OPEN", "PENDING", "SOLVED", "CLOSED"];
const TICKET_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export function MacroBuilder({ initialActions = [], onChange }: MacroBuilderProps) {
    const [actions, setActions] = useState<Action[]>(initialActions);

    useEffect(() => {
        onChange(actions);
    }, [actions, onChange]);

    const addAction = () => {
        setActions([...actions, { action: "comment", value: "" }]);
    };

    const removeAction = (index: number) => {
        const newActions = [...actions];
        newActions.splice(index, 1);
        setActions(newActions);
    };

    const updateActionType = (index: number, newType: string) => {
        const newActions = [...actions];
        newActions[index].action = newType;
        // Reset value if switching to/from inputs that require specific formats
        if (newType === "set_status") newActions[index].value = "SOLVED";
        else if (newType === "set_priority") newActions[index].value = "HIGH";
        else newActions[index].value = "";

        setActions(newActions);
    };

    const updateActionValue = (index: number, newValue: string) => {
        const newActions = [...actions];
        newActions[index].value = newValue;
        setActions(newActions);
    };

    return (
        <div className="space-y-4">
            {actions.map((action, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border rounded-md bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Action</Label>
                            <Select
                                value={action.action}
                                onValueChange={(val) => updateActionType(index, val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ACTION_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-xs text-muted-foreground">Value</Label>
                            {renderValueInput(action, (val) => updateActionValue(index, val))}
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive mt-6"
                        onClick={() => removeAction(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={addAction} className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                Add Action
            </Button>
        </div>
    );
}

function renderValueInput(action: Action, onChange: (val: string) => void) {
    if (action.action === "set_status") {
        return (
            <Select value={action.value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {TICKET_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (action.action === "set_priority") {
        return (
            <Select value={action.value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {TICKET_PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (action.action === "comment" || action.action === "comment_internal") {
        return (
            <Textarea
                value={action.value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter comment text..."
                rows={3}
            />
        );
    }

    return (
        <Input
            value={action.value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Value..."
        />
    );
}
