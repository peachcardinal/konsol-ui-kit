/**
 * Модалка «Изменить стоимость заданий» по макету Figma (*Modal* node-id 25447:76901).
 *
 * Описание по макету:
 * - Шапка (по макету Header 25447:76902): *Title* — текст «Изменить стоимость заданий», *Button* — iconOnly close.
 * - Контент: форма — Цена (₽), Количество, Стоимость (₽, вычисляемое).
 * - Футер: кнопки «Отменить» и «Изменить» (primary).
 *
 * Компоненты: SideModal (layout), Button, FormItem, InputBasic.
 * Стили: палитра colors.css, текстовые стили по правилам.
 */
import { useState, useCallback, useMemo } from "react";
import { Button } from "../button";
import { SideModal } from "../SideModal/SideModal";
import { FormItem } from "../form-item";
import { InputBasic } from "../Input";
import "./ChangeCostModal.css";

/** Отбивка тысяч пробелом: 10500 → "10 500" */
function formatThousands(digitsOnly) {
  const s = String(digitsOnly).replace(/\D/g, "");
  if (!s) return "";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Из строки "10 000 ₽" или "10000" получаем число */
function parsePrice(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function ChangeCostModal({ initialPrice = "", initialQuantity = "1", onClose, onSave }) {
  const [priceInput, setPriceInput] = useState(() =>
    initialPrice != null && initialPrice !== "" ? formatThousands(String(initialPrice).replace(/\D/g, "")) : ""
  );
  const [quantityInput, setQuantityInput] = useState(() =>
    initialQuantity != null && initialQuantity !== "" ? String(initialQuantity).replace(/\D/g, "") : "1"
  );

  const priceNum = useMemo(() => parsePrice(priceInput), [priceInput]);
  const quantityNum = useMemo(() => (quantityInput === "" ? 0 : Math.max(0, parseInt(quantityInput, 10) || 0)), [quantityInput]);
  const costNum = priceNum * quantityNum;

  const costDisplay = useMemo(() => (costNum > 0 ? formatThousands(costNum) : ""), [costNum]);

  const handlePriceChange = useCallback((e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setPriceInput(formatThousands(raw));
  }, []);

  const handleQuantityChange = useCallback((e) => {
    const v = e.target.value.replace(/\D/g, "");
    setQuantityInput(v === "" ? "" : v);
  }, []);

  const handleSubmit = useCallback(() => {
    onSave?.({ price: priceNum, quantity: quantityNum, cost: costNum });
    onClose?.();
  }, [priceNum, quantityNum, costNum, onSave, onClose]);

  return (
    <SideModal
      title="Изменить стоимость заданий"
      onClose={onClose}
      ariaLabelledById="change-cost-modal-title"
      footer={
        <Button
          variant="primary"
          size="lg"
          className="change-cost-modal__submit"
          onClick={handleSubmit}
        >
          Изменить
        </Button>
      }
    >
      <div className="change-cost-modal__form">
        <div className="change-cost-modal__row">
          <FormItem label="Цена">
            <InputBasic
              value={priceInput}
              onChange={handlePriceChange}
              placeholder="0"
              suffix=" ₽"
              className="change-cost-modal__input"
            />
          </FormItem>
          <FormItem label="Количество">
            <InputBasic
              value={quantityInput}
              onChange={handleQuantityChange}
              placeholder="1"
              className="change-cost-modal__input"
            />
          </FormItem>
        </div>
        <FormItem label="Стоимость">
          <InputBasic
            value={costDisplay}
            disabled
            suffix=" ₽"
            className="change-cost-modal__input"
          />
        </FormItem>
      </div>
    </SideModal>
  );
}

export default ChangeCostModal;
