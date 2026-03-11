import React, { useMemo } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function buildItems(current, totalPages) {
  if (totalPages <= 1) return [{ type: "page", page: 1 }];
  const boundaryCount = 1;
  const siblingCount = 1;
  const startPages = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const endPages = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + 1 + i
  );
  const siblingsStart = Math.max(
    Math.min(
      current - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(
      current + siblingCount,
      boundaryCount + siblingCount * 2 + 2
    ),
    totalPages - boundaryCount - 1
  );
  const res = [];
  res.push(...startPages.map((p) => ({ type: "page", page: p })));
  if (siblingsStart > boundaryCount + 2) {
    res.push({ type: "jump-prev" });
  } else if (boundaryCount + 1 < totalPages - boundaryCount) {
    res.push({ type: "page", page: boundaryCount + 1 });
  }
  for (let p = siblingsStart; p <= siblingsEnd; p += 1) {
    res.push({ type: "page", page: p });
  }
  if (siblingsEnd < totalPages - boundaryCount - 1) {
    res.push({ type: "jump-next" });
  } else if (totalPages - boundaryCount > boundaryCount) {
    res.push({ type: "page", page: totalPages - boundaryCount });
  }
  res.push(...endPages.map((p) => ({ type: "page", page: p })));
  const seen = new Set();
  return res.filter((it) => {
    const k = it.type === "page" ? `p:${it.page}` : it.type;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function Pagination({
  current,
  total,
  pageSize = 10,
  onChange,
  className,
  disabled,
  hideOnSinglePage = true,
}) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  const safeCurrent = clamp(current || 1, 1, totalPages);

  const items = useMemo(
    () => [{ type: "prev" }, ...buildItems(safeCurrent, totalPages), { type: "next" }],
    [safeCurrent, totalPages]
  );

  if (hideOnSinglePage && totalPages <= 1) return null;

  const goto = (p) => {
    if (disabled) return;
    const next = clamp(p, 1, totalPages);
    if (next === safeCurrent) return;
    onChange(next, pageSize);
  };

  const handleClick = (item) => {
    if (disabled) return;
    switch (item.type) {
      case "prev":
        return goto(safeCurrent - 1);
      case "next":
        return goto(safeCurrent + 1);
      case "jump-prev":
        return goto(safeCurrent - 5);
      case "jump-next":
        return goto(safeCurrent + 5);
      case "page":
        return goto(item.page);
    }
  };

  return (
    <div
      className={cn("flex items-center justify-between gap-3 flex-wrap", className)}
      data-testid="paginator"
    >
      <div className="flex items-center gap-1 flex-wrap">
        {items.map((item, idx) => {
          const isActive = item.type === "page" && item.page === safeCurrent;
          const key = `${item.type}-${item.type === "page" ? item.page : idx}`;

          const content =
            item.type === "prev" || item.type === "next" ? (
              <Button
                variant="text"
                size="md"
                iconOnly
                icon={item.type === "prev" ? "ArrowLeftIcon" : "ArrowRightIcon"}
                className="h-8 w-8 rounded-md p-0 hover:bg-default-background focus:bg-default-background"
                disabled={
                  disabled ||
                  (item.type === "prev"
                    ? safeCurrent <= 1
                    : safeCurrent >= totalPages)
                }
                aria-label={item.type === "prev" ? "Prev page" : "Next page"}
                onClick={() => handleClick(item)}
              />
            ) : item.type === "jump-prev" || item.type === "jump-next" ? (
              <Button
                variant="text"
                size="md"
                className="h-8 w-8 min-w-8 rounded-md px-0 hover:bg-default-background focus:bg-default-background"
                disabled={disabled}
                aria-label={
                  item.type === "jump-prev" ? "Jump prev pages" : "Jump next pages"
                }
                onClick={() => handleClick(item)}
              >
                …
              </Button>
            ) : (
              <Button
                variant="text"
                size="md"
                className={cn(
                  "h-8 w-8 min-w-8 rounded-md px-0 hover:bg-default-background focus:bg-default-background",
                  {
                    "border border-solid border-primary bg-background text-primary hover:bg-background focus:bg-background":
                      isActive,
                    "text-default": !isActive,
                  }
                )}
                isActive={isActive}
                disabled={disabled}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${item.page}`}
                onClick={() => handleClick(item)}
              >
                {String(item.page)}
              </Button>
            );

          return <span key={key}>{content}</span>;
        })}
      </div>
    </div>
  );
}
