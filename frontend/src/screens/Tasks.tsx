// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { ApiError, apiFetch, clearSessionToken } from "@/lib/api";
import { useNavigate } from "@/lib/navigate";

const { Edit, Filter, ArrowLeft, ArrowRight } = Icons;

const FILTERS = [
  { key: "all", label: "All", wf: "i-2-0-0" },
  { key: "active", label: "Active", wf: "i-2-0-1" },
  { key: "completed", label: "Completed", wf: "i-2-0-2" },
];

const MAX_TITLE = 255;
const TODAY = new Date(2026, 10, 17);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatAdded(task) {
  if (task.justNow) return "Added just now";
  const d = task.created_at;
  const time = pad(d.getHours()) + ":" + pad(d.getMinutes());
  const dayDiff = Math.round(
    (TODAY - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000,
  );
  if (dayDiff === 0) return "Added today, " + time;
  if (dayDiff === 1) return "Added yesterday, " + time;
  return "Added " + DAYS[d.getDay()] + " " + d.getDate() + " " + MONTHS[d.getMonth()];
}

export default function Screen() {
  const [tasks, setTasks] = React.useState([]);
  const navigate = useNavigate();
  const [loadError, setLoadError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("all");
  const [draft, setDraft] = React.useState("");
  const [addError, setAddError] = React.useState("");
  const [editingId, setEditingId] = React.useState(null);
  const [editDraft, setEditDraft] = React.useState("");
  const [editError, setEditError] = React.useState("");
  const [pendingDelete, setPendingDelete] = React.useState(null);
  const [notice, setNotice] = React.useState("");
  const nextId = React.useRef(200);
  const addRef = React.useRef(null);
  const editRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const deleteRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  React.useEffect(() => {
    let cancelled = false;
    apiFetch("/tasks")
      .then((rows) => {
        if (cancelled) return;
        setTasks(rows.map((r) => ({ ...r, created_at: new Date(r.created_at) })));
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          clearSessionToken();
          navigate("login");
          return;
        }
        setLoadError("We could not load your tasks. Please try again.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(t);
  }, [notice]);

  React.useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingId]);

  React.useEffect(() => {
    if (pendingDelete && cancelRef.current) cancelRef.current.focus();
  }, [pendingDelete]);

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.completed).length;
  const activeCount = total - doneCount;
  const counts = { all: total, active: activeCount, completed: doneCount };
  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed,
  );
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const validate = (raw) => {
    const t = raw.trim();
    if (!t) return { error: "A task needs a title. Type what you need to do and try again." };
    if (t.length > MAX_TITLE)
      return {
        error:
          "Titles can be up to 255 characters. This one is " + t.length + ", so nothing was saved.",
      };
    return { value: t };
  };

  const addTask = (e) => {
    e.preventDefault();
    const r = validate(draft);
    if (r.error) {
      setAddError(r.error);
      return;
    }
    nextId.current += 1;
    const task = {
      id: "tsk-" + nextId.current,
      title: r.value,
      completed: false,
      created_at: new Date(2026, 10, 17, 12, 0),
      justNow: true,
    };
    setTasks((prev) => [task, ...prev]);
    setDraft("");
    setAddError("");
    if (filter === "completed") setFilter("all");
    setNotice(
      "Added “" +
        r.value.slice(0, 60) +
        (r.value.length > 60 ? "…" : "") +
        "” to the top of your list.",
    );
    if (addRef.current) addRef.current.focus();
  };

  const toggleTask = (task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
    setNotice(task.completed ? "Moved back to Active." : "Marked as completed.");
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditDraft(task.title);
    setEditError("");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };
  const saveEdit = (e) => {
    e.preventDefault();
    const r = validate(editDraft);
    if (r.error) {
      setEditError(r.error + " Your previous title is still saved.");
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, title: r.value } : t)));
    setEditingId(null);
    setEditError("");
    setNotice("Title updated.");
  };

  const askDelete = (task, el) => {
    triggerRef.current = el;
    setPendingDelete(task);
  };
  const closeDelete = () => {
    setPendingDelete(null);
    setTimeout(() => {
      if (triggerRef.current && document.contains(triggerRef.current)) triggerRef.current.focus();
      else if (addRef.current) addRef.current.focus();
    }, 0);
  };
  const confirmDelete = () => {
    const gone = pendingDelete;
    setTasks((prev) => prev.filter((t) => t.id !== gone.id));
    setPendingDelete(null);
    setNotice(
      "Deleted “" +
        gone.title.slice(0, 60) +
        (gone.title.length > 60 ? "…" : "") +
        "” permanently.",
    );
    setTimeout(() => {
      if (addRef.current) addRef.current.focus();
    }, 0);
  };

  const onModalKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDelete();
      return;
    }
    if (e.key === "Tab") {
      const first = cancelRef.current;
      const last = deleteRef.current;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const onTabKey = (e, idx) => {
    let n = null;
    if (e.key === "ArrowRight") n = (idx + 1) % FILTERS.length;
    if (e.key === "ArrowLeft") n = (idx + FILTERS.length - 1) % FILTERS.length;
    if (n !== null) {
      e.preventDefault();
      setFilter(FILTERS[n].key);
      const el = document.getElementById("np-tab-" + FILTERS[n].key);
      if (el) el.focus();
    }
  };

  const bg = brand.backgroundColor;
  const text = "color-mix(in srgb, white 94%, transparent)";
  const muted = brand.neutralColor;
  const hairline = "color-mix(in srgb, white 14%, transparent)";
  const gradient = "linear-gradient(120deg, " + brand.primaryColor + ", " + brand.accentColor + ")";
  const glass = {
    background: "color-mix(in srgb, white 8%, transparent)",
    border: "1px solid " + hairline,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: brand.radius,
  };
  const canvas = {
    minHeight: "100%",
    color: text,
    fontFamily: brand.fontBody,
    background:
      "radial-gradient(700px 420px at 90% -8%, color-mix(in srgb, " +
      brand.accentColor +
      " 30%, transparent), transparent), " +
      "radial-gradient(640px 420px at -5% 12%, color-mix(in srgb, " +
      brand.primaryColor +
      " 22%, transparent), transparent), " +
      "linear-gradient(165deg, color-mix(in srgb, " +
      bg +
      " 26%, black), color-mix(in srgb, " +
      bg +
      " 14%, black))",
    "--np-primary": brand.primaryColor,
    "--np-accent": brand.accentColor,
  };
  const pill = (active) => ({
    borderRadius: 999,
    minHeight: 44,
    background: active ? gradient : "color-mix(in srgb, white 6%, transparent)",
    color: active ? "color-mix(in srgb, " + bg + " 10%, black)" : text,
    border: "1px solid " + (active ? "transparent" : hairline),
    boxShadow: active
      ? "0 8px 40px color-mix(in srgb, " + brand.accentColor + " 45%, transparent)"
      : "none",
  });
  const ghostBtn = {
    borderRadius: brand.radius,
    minHeight: 44,
    border: "1px solid " + hairline,
    background: "color-mix(in srgb, white 6%, transparent)",
    color: text,
    fontFamily: brand.fontBody,
  };

  const fieldId = "np-add-title";
  const emptyAll = total === 0;

  return (
    <div className="np" style={canvas}>
      <style>{`
        .np *:focus-visible{outline:2px solid var(--np-primary);outline-offset:2px}
        .np-btn{transition:transform .15s ease, filter .15s ease, background-color .15s ease, box-shadow .2s ease}
        .np-btn:hover:not(:disabled){filter:brightness(1.12)}
        .np-btn:active:not(:disabled){transform:translateY(1px) scale(.99)}
        .np-ghost:hover{background:color-mix(in srgb, white 14%, transparent)!important}
        .np-input::placeholder{color:color-mix(in srgb, white 52%, transparent)}
        .np-input{transition:border-color .15s ease, box-shadow .2s ease}
        .np-input:focus{border-color:var(--np-primary)!important;box-shadow:0 0 0 4px color-mix(in srgb, var(--np-primary) 25%, transparent)}
        .np-row{animation:np-in .28s ease both}
        .np-row:hover{background:color-mix(in srgb, white 5%, transparent)}
        .np-modal{animation:np-pop .22s ease both}
        .np-scrim{animation:np-fade .2s ease both}
        .np-toast{animation:np-in .25s ease both}
        .np-shimmer{background:linear-gradient(90deg, color-mix(in srgb, white 5%, transparent), color-mix(in srgb, white 13%, transparent), color-mix(in srgb, white 5%, transparent));background-size:200% 100%;animation:np-sheen 1.3s linear infinite}
        .np-pulse{animation:np-beat 2.4s ease-in-out infinite}
        @keyframes np-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes np-pop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes np-fade{from{opacity:0}to{opacity:1}}
        @keyframes np-sheen{from{background-position:200% 0}to{background-position:-200% 0}}
        @keyframes np-beat{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb, var(--np-primary) 60%, transparent)}50%{box-shadow:0 0 0 8px transparent}}
        @media (prefers-reduced-motion: reduce){.np *{animation:none!important;transition:none!important}}
      `}</style>

      <div className="mx-auto w-full px-4 py-8 sm:px-8 sm:py-12" style={{ maxWidth: 880 }}>
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1
              data-wf="b-0-0"
              style={{
                fontFamily: brand.fontHeading,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                fontSize: "clamp(40px, 8vw, 64px)",
                margin: 0,
              }}
            >
              My tasks
            </h1>
            <p className="mt-3 flex items-center gap-2" style={{ color: muted, fontSize: 14 }}>
              <span
                className="np-pulse inline-block rounded-full"
                style={{ width: 8, height: 8, background: brand.primaryColor }}
                aria-hidden="true"
              />
              Saved to your account
            </p>
          </div>
        </header>

        {/* Progress glance */}
        <section aria-label="Progress" className="mt-8 p-5 sm:p-6" style={glass}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span
                style={{
                  fontSize: "clamp(48px, 9vw, 72px)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                  backgroundImage: gradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {activeCount}
              </span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                {activeCount === 1 ? "task left to do" : "tasks left to do"}
              </span>
            </div>
            <p
              style={{ color: muted, fontSize: 14, fontVariantNumeric: "tabular-nums", margin: 0 }}
            >
              {doneCount} of {total} completed
            </p>
          </div>
          <div
            className="mt-4 overflow-hidden"
            style={{
              height: 8,
              borderRadius: 999,
              background: "color-mix(in srgb, white 10%, transparent)",
            }}
            role="progressbar"
            aria-label="Tasks completed"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div
              style={{
                width: pct + "%",
                height: "100%",
                borderRadius: 999,
                background: gradient,
                boxShadow: "0 0 24px " + brand.accentColor,
                transition: "width .5s ease",
              }}
            />
          </div>
        </section>

        {/* Add */}
        <form onSubmit={addTask} noValidate className="mt-8" aria-label="Add a task">
          <label
            htmlFor={fieldId}
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: muted,
              marginBottom: 8,
            }}
          >
            Add a task
          </label>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 sm:col-span-9">
              <input
                id={fieldId}
                ref={addRef}
                data-wf="b-1-0"
                className="np-input w-full px-4"
                type="text"
                autoComplete="off"
                value={draft}
                placeholder="e.g. Pick up the dry cleaning"
                aria-invalid={addError ? "true" : "false"}
                aria-describedby={"np-add-help" + (addError ? " np-add-error" : "")}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (addError) setAddError("");
                }}
                style={{
                  height: 56,
                  fontSize: 16,
                  color: text,
                  fontFamily: brand.fontBody,
                  borderRadius: brand.radius,
                  background: "color-mix(in srgb, white 8%, transparent)",
                  border: "1px solid " + (addError ? brand.accentColor : hairline),
                  outline: "none",
                }}
              />
            </div>
            <div className="col-span-12 sm:col-span-3">
              <button
                type="submit"
                data-wf="b-1-1"
                className="np-btn w-full inline-flex items-center justify-center gap-2 px-4"
                style={{
                  height: 56,
                  borderRadius: brand.radius,
                  background: gradient,
                  border: "none",
                  cursor: "pointer",
                  color: "color-mix(in srgb, " + bg + " 10%, black)",
                  fontWeight: 800,
                  fontSize: 16,
                  fontFamily: brand.fontBody,
                  boxShadow:
                    "0 12px 48px color-mix(in srgb, " + brand.accentColor + " 45%, transparent)",
                }}
              >
                <Icons.Plus className="w-5 h-5" aria-hidden="true" />
                Add
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2" style={{ fontSize: 13 }}>
            <span id="np-add-help" style={{ color: muted }}>
              Press Enter to add. New tasks start as not completed.
            </span>
            <span
              style={{
                color: draft.trim().length > MAX_TITLE ? brand.accentColor : muted,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {draft.trim().length}/{MAX_TITLE}
            </span>
          </div>
          {addError && (
            <p
              id="np-add-error"
              role="alert"
              className="np-toast mt-2 flex items-start gap-2 px-4 py-3"
              style={{
                borderRadius: brand.radius,
                border: "1px solid " + brand.accentColor,
                background: "color-mix(in srgb, " + brand.accentColor + " 14%, transparent)",
                fontSize: 14,
              }}
            >
              <Icons.AlertCircle
                className="w-5 h-5 shrink-0"
                aria-hidden="true"
                style={{ color: brand.accentColor }}
              />
              <span>
                <strong>Not saved. </strong>
                {addError}
              </span>
            </p>
          )}
        </form>

        {/* Filter tabs */}
        <div
          data-wf="b-2-0"
          role="tablist"
          aria-label="Filter tasks"
          className="mt-8 flex flex-wrap gap-2"
        >
          {FILTERS.map((f, i) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                id={"np-tab-" + f.key}
                data-wf={f.wf}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls="np-panel"
                tabIndex={active ? 0 : -1}
                className="np-btn inline-flex items-center gap-2 px-5"
                style={{
                  ...pill(active),
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: brand.fontBody,
                }}
                onClick={() => setFilter(f.key)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                {active && <Icons.Check className="w-4 h-4" aria-hidden="true" />}
                {f.label}
                <span style={{ fontVariantNumeric: "tabular-nums", opacity: 0.8, fontSize: 13 }}>
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <section
          id="np-panel"
          role="tabpanel"
          aria-labelledby={"np-tab-" + filter}
          data-wf="b-3-0"
          className="mt-4"
          style={{ ...glass, overflow: "hidden" }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-6"
            style={{ borderBottom: "1px solid " + hairline }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Tasks, newest first</h2>
            {!loading && !emptyAll && (
              <span style={{ color: muted, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                Showing {visible.length} of {total}
              </span>
            )}
          </div>

          {loading && (
            <div aria-busy="true" aria-live="polite" className="p-5 sm:p-6">
              <span className="sr-only">Loading your tasks…</span>
              {[0, 1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="np-shimmer mb-3"
                  style={{ height: 64, borderRadius: brand.radius, opacity: 1 - n * 0.18 }}
                />
              ))}
            </div>
          )}

          {!loading && loadError && (
            <p role="alert" className="px-6 py-8 text-center">
              {loadError}
            </p>
          )}

          {!loading && !loadError && emptyAll && (
            <div data-wf="b-4-0" className="flex flex-col items-center px-6 py-12 text-center">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  background: gradient,
                  boxShadow: "0 0 64px " + brand.accentColor,
                }}
              >
                <Icons.CheckCircle
                  className="w-8 h-8"
                  aria-hidden="true"
                  style={{ color: "color-mix(in srgb, " + bg + " 10%, black)" }}
                />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginTop: 24, marginBottom: 8 }}>
                No tasks yet.
              </h3>
              <p style={{ color: muted, fontSize: 16, maxWidth: 360, margin: 0 }}>
                Add your first task above. It's saved to your account, so it will be here after you
                log out and back in.
              </p>
              <button
                type="button"
                className="np-btn mt-6 inline-flex items-center gap-2 px-5"
                style={{ ...ghostBtn, cursor: "pointer", fontWeight: 700 }}
                onClick={() => addRef.current && addRef.current.focus()}
              >
                <Icons.ArrowRight
                  className="w-4 h-4"
                  aria-hidden="true"
                  style={{ transform: "rotate(-90deg)" }}
                />
                Go to the add field
              </button>
            </div>
          )}

          {!loading && !emptyAll && visible.length === 0 && (
            <div className="px-6 py-12 text-center np-row">
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                {filter === "active" ? "Nothing left to do." : "No completed tasks yet."}
              </h3>
              <p style={{ color: muted, fontSize: 15, margin: "8px 0 20px" }}>
                {filter === "active"
                  ? "Every task you have is marked completed."
                  : "Tick a task off and it will show up here."}
              </p>
              <button
                type="button"
                className="np-btn np-ghost px-5"
                style={{ ...ghostBtn, cursor: "pointer", fontWeight: 700 }}
                onClick={() => setFilter("all")}
              >
                Show all tasks
              </button>
            </div>
          )}

          {!loading && visible.length > 0 && (
            <ul aria-label="Tasks, newest first" className="m-0 p-0" style={{ listStyle: "none" }}>
              {visible.map((task, idx) => {
                const editing = editingId === task.id;
                return (
                  <li
                    key={task.id}
                    data-wf={"i-3-0-" + idx}
                    className="np-row flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-6"
                    style={{ borderTop: idx === 0 ? "none" : "1px solid " + hairline }}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      aria-label={
                        (task.completed ? "Mark as not completed: " : "Mark as completed: ") +
                        task.title
                      }
                      className="np-btn inline-flex items-center justify-center shrink-0"
                      onClick={() => toggleTask(task)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        cursor: "pointer",
                        border:
                          "1px solid " + (task.completed ? "transparent" : brand.neutralColor),
                        background: task.completed ? gradient : "transparent",
                        color: "color-mix(in srgb, " + bg + " 10%, black)",
                      }}
                    >
                      {task.completed && <Icons.Check className="w-5 h-5" aria-hidden="true" />}
                    </button>

                    {editing ? (
                      <form
                        onSubmit={saveEdit}
                        noValidate
                        className="flex flex-wrap items-start gap-3"
                        style={{ flex: "1 1 260px", minWidth: 0 }}
                      >
                        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                          <label htmlFor={"np-edit-" + task.id} className="sr-only">
                            Edit task title
                          </label>
                          <input
                            id={"np-edit-" + task.id}
                            ref={editRef}
                            className="np-input w-full px-4"
                            type="text"
                            value={editDraft}
                            aria-invalid={editError ? "true" : "false"}
                            aria-describedby={editError ? "np-edit-error" : undefined}
                            onChange={(e) => {
                              setEditDraft(e.target.value);
                              if (editError) setEditError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                e.preventDefault();
                                cancelEdit();
                              }
                            }}
                            style={{
                              height: 44,
                              fontSize: 16,
                              color: text,
                              fontFamily: brand.fontBody,
                              borderRadius: brand.radius,
                              background: "color-mix(in srgb, white 8%, transparent)",
                              border: "1px solid " + (editError ? brand.accentColor : hairline),
                              outline: "none",
                            }}
                          />
                          {editError && (
                            <p
                              id="np-edit-error"
                              role="alert"
                              className="mt-2 flex items-start gap-2"
                              style={{ fontSize: 13, margin: "8px 0 0" }}
                            >
                              <Icons.AlertCircle
                                className="w-4 h-4 shrink-0"
                                aria-hidden="true"
                                style={{ color: brand.accentColor, marginTop: 2 }}
                              />
                              <span>{editError}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="np-btn inline-flex items-center gap-2 px-4"
                            style={{
                              minHeight: 44,
                              borderRadius: brand.radius,
                              background: gradient,
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 800,
                              fontSize: 14,
                              color: "color-mix(in srgb, " + bg + " 10%, black)",
                              fontFamily: brand.fontBody,
                            }}
                          >
                            <Icons.Check className="w-4 h-4" aria-hidden="true" /> Save
                          </button>
                          <button
                            type="button"
                            className="np-btn np-ghost inline-flex items-center gap-2 px-4"
                            style={{
                              ...ghostBtn,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                            onClick={cancelEdit}
                          >
                            <Icons.X className="w-4 h-4" aria-hidden="true" /> Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 17,
                              fontWeight: 600,
                              lineHeight: 1.4,
                              overflowWrap: "anywhere",
                              textDecoration: task.completed ? "line-through" : "none",
                              color: task.completed ? muted : text,
                            }}
                          >
                            {task.title}
                          </p>
                          <p
                            className="flex flex-wrap items-center gap-2"
                            style={{
                              margin: "4px 0 0",
                              fontSize: 13,
                              color: muted,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {task.completed ? (
                              <span
                                className="inline-flex items-center gap-1 px-2"
                                style={{
                                  borderRadius: 999,
                                  border: "1px solid " + brand.primaryColor,
                                  color: brand.primaryColor,
                                  fontWeight: 700,
                                  fontSize: 12,
                                  lineHeight: "20px",
                                }}
                              >
                                <Icons.Check className="w-3 h-3" aria-hidden="true" /> Done
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-2"
                                style={{
                                  borderRadius: 999,
                                  border: "1px solid " + hairline,
                                  fontWeight: 700,
                                  fontSize: 12,
                                  lineHeight: "20px",
                                }}
                              >
                                <Icons.Clock className="w-3 h-3" aria-hidden="true" /> To do
                              </span>
                            )}
                            <span>{formatAdded(task)}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="np-btn np-ghost inline-flex items-center gap-2 px-3"
                            style={{
                              ...ghostBtn,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                            aria-label={"Edit title: " + task.title}
                            onClick={() => startEdit(task)}
                          >
                            <Icons.Edit className="w-4 h-4" aria-hidden="true" /> Edit
                          </button>
                          <button
                            type="button"
                            className="np-btn np-ghost inline-flex items-center gap-2 px-3"
                            style={{
                              ...ghostBtn,
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                            aria-label={"Delete task: " + task.title}
                            onClick={(e) => askDelete(task, e.currentTarget)}
                          >
                            <Icons.Trash className="w-4 h-4" aria-hidden="true" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div role="status" aria-live="polite" className="mt-4" style={{ minHeight: 44 }}>
          {notice && (
            <p
              className="np-toast inline-flex items-center gap-2 px-4 py-2"
              style={{ ...glass, borderRadius: 999, margin: 0, fontSize: 14 }}
            >
              <Icons.CheckCircle
                className="w-4 h-4 shrink-0"
                aria-hidden="true"
                style={{ color: brand.primaryColor }}
              />
              {notice}
            </p>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {pendingDelete && (
        <div
          className="np-scrim fixed inset-0 flex items-center justify-center p-4"
          style={{
            zIndex: 50,
            background: "color-mix(in srgb, " + bg + " 20%, black)",
            backgroundColor: "color-mix(in srgb, black 66%, transparent)",
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDelete();
          }}
        >
          <div
            data-wf="b-5-0"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="np-del-title"
            aria-describedby="np-del-desc"
            onKeyDown={onModalKey}
            className="np-modal w-full p-6 sm:p-8"
            style={{
              maxWidth: 460,
              borderRadius: brand.radius,
              color: text,
              fontFamily: brand.fontBody,
              background: "color-mix(in srgb, " + bg + " 22%, black)",
              border: "1px solid " + hairline,
              boxShadow:
                "0 24px 120px color-mix(in srgb, " + brand.accentColor + " 40%, transparent)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: "color-mix(in srgb, " + brand.accentColor + " 20%, transparent)",
                border: "1px solid " + brand.accentColor,
              }}
            >
              <Icons.Trash
                className="w-5 h-5"
                aria-hidden="true"
                style={{ color: brand.accentColor }}
              />
            </div>
            <h2
              id="np-del-title"
              style={{
                fontSize: 24,
                fontWeight: 900,
                lineHeight: 1.2,
                margin: "16px 0 8px",
                overflowWrap: "anywhere",
              }}
            >
              Delete “
              {pendingDelete.title.length > 120
                ? pendingDelete.title.slice(0, 120) + "…"
                : pendingDelete.title}
              ”?
            </h2>
            <p id="np-del-desc" style={{ margin: 0, color: muted, fontSize: 15, lineHeight: 1.5 }}>
              This is permanent and cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                ref={cancelRef}
                type="button"
                data-wf="i-5-0-0"
                className="np-btn np-ghost inline-flex items-center gap-2 px-5"
                style={{ ...ghostBtn, cursor: "pointer", fontWeight: 700 }}
                onClick={closeDelete}
              >
                <Icons.X className="w-4 h-4" aria-hidden="true" /> Cancel
              </button>
              <button
                ref={deleteRef}
                type="button"
                data-wf="i-5-0-1"
                className="np-btn inline-flex items-center gap-2 px-5"
                style={{
                  minHeight: 44,
                  borderRadius: brand.radius,
                  background: brand.accentColor,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 800,
                  color: "color-mix(in srgb, " + bg + " 10%, black)",
                  fontFamily: brand.fontBody,
                  boxShadow:
                    "0 8px 40px color-mix(in srgb, " + brand.accentColor + " 50%, transparent)",
                }}
                onClick={confirmDelete}
              >
                <Icons.Trash className="w-4 h-4" aria-hidden="true" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
