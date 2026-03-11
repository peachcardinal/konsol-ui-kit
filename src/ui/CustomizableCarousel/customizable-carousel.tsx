import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'

import { cva } from 'class-variance-authority'
import useEmblaCarousel from 'embla-carousel-react'

import { cn } from '@/lib/utils'

// Типы для настроек индикаторов
export interface IndicatorOptions {
  show: boolean
  position: 'inside' | 'outside'
  align: 'start' | 'center' | 'end' | 'stretch'
  className?: string
  activeClassName: string
  inactiveClassName: string
}

// Опции для хука карусели
export interface UseCarouselOptions extends EmblaOptionsType {
  // Начальный активный слайд
  defaultActive?: number
  // Опции для индикаторов
  indicators?: Partial<IndicatorOptions>
}

// Значения по умолчанию для настроек индикаторов
const defaultIndicatorOptions: IndicatorOptions = {
  show: true,
  position: 'outside',
  align: 'center',
  activeClassName: 'bg-default',
  inactiveClassName: 'bg-default opacity-40',
}

// Тип состояния карусели
export interface UseCarouselState {
  // Текущий активный слайд
  active: number
  // Ссылка на элемент карусели
  emblaRef: ReturnType<typeof useEmblaCarousel>[0]
  // Инстанс Embla
  embla: EmblaCarouselType | undefined
  // Опции индикаторов
  indicatorOptions: IndicatorOptions
  // Методы для управления каруселью
  next: () => void
  prev: () => void
  scrollTo: (index: number) => void
  // Обработчик изменения слайда
  onChange: (index: number) => void
  // Информация о доступности кнопок навигации
  canScrollNext: boolean
  canScrollPrev: boolean
}

// Хук для управления каруселью
export function useCarousel(options?: UseCarouselOptions): UseCarouselState {
  // Отделяем опции для индикаторов от опций карусели
  const { indicators, defaultActive = 0, ...emblaOptions } = options || {}

  // Объединяем переданные опции с опциями по умолчанию
  const carouselOptions = {
    align: 'start',
    loop: false,
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    ...emblaOptions,
  } as const

  // Объединяем настройки индикаторов с настройками по умолчанию
  const indicatorOptions: IndicatorOptions = {
    ...defaultIndicatorOptions,
    ...indicators,
  }

  // Инициализация карусели и состояния
  const [emblaRef, embla] = useEmblaCarousel(carouselOptions)
  const [active, setActive] = useState(defaultActive)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [canScrollPrev, setCanScrollPrev] = useState(false)

  // Обработчик изменения слайда
  const onSelect = useCallback(() => {
    if (!embla)
      return
    setActive(embla.selectedScrollSnap())
    setCanScrollNext(embla.canScrollNext())
    setCanScrollPrev(embla.canScrollPrev())
  }, [embla])

  // Эффект для отслеживания изменения слайда
  useEffect(() => {
    if (!embla)
      return

    embla.on('select', onSelect)
    embla.on('reInit', onSelect)

    // Установка начального слайда
    if (defaultActive > 0 && defaultActive < embla.slideNodes().length) {
      embla.scrollTo(defaultActive)
    }

    onSelect() // Инициализация индекса при монтировании

    return () => {
      embla.off('select', onSelect) // Очистка при размонтировании
      embla.off('reInit', onSelect)
    }
  }, [embla, onSelect, defaultActive])

  // Обработчик для прокрутки к конкретному слайду
  const scrollTo = useCallback((index: number) => {
    if (!embla)
      return
    embla.scrollTo(index)
  }, [embla])

  // Обработчик для перехода к следующему слайду
  const next = useCallback(() => {
    if (!embla)
      return
    embla.scrollNext()
  }, [embla])

  // Обработчик для перехода к предыдущему слайду
  const prev = useCallback(() => {
    if (!embla)
      return
    embla.scrollPrev()
  }, [embla])

  // Обработчик изменения слайда извне
  const onChange = useCallback((index: number) => {
    scrollTo(index)
  }, [scrollTo])

  return {
    active,
    emblaRef,
    embla,
    indicatorOptions,
    next,
    prev,
    scrollTo,
    onChange,
    canScrollNext,
    canScrollPrev,
  }
}

// Контекст для карусели
type CarouselContextType = UseCarouselState | null
const CarouselContext = createContext<CarouselContextType>(null)

// Хук для использования контекста карусели
export function useCarouselContext() {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('Компоненты карусели должны использоваться внутри Carousel')
  }
  return context
}

// Основной компонент карусели
interface CarouselProps {
  children: React.ReactNode
  className?: string
  options?: UseCarouselOptions
}

function CarouselRoot({ children, className, options }: CarouselProps) {
  const carouselState = useCarousel(options)

  return (
    <CarouselContext.Provider value={carouselState}>
      <div className={cn('relative w-full', className)}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

// Компонент для слайдов
interface CarouselItemsProps {
  items: React.ReactNode[]
  className?: string
  slideClassName?: string
}

function CarouselItems({ items, className, slideClassName }: CarouselItemsProps) {
  const { emblaRef } = useCarouselContext()

  return (
    <div ref={emblaRef} className={cn('overflow-hidden', className)}>
      <div className="flex">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={cn('flex-[0_0_100%] min-w-0', slideClassName)}
            style={{ flex: '0 0 100%' }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

// Компонент для отображения текстового содержимого
export interface CarouselContentProps {
  items: Array<{
    title?: React.ReactNode
    text?: React.ReactNode
    [key: string]: any
  }>
  className?: string
  titleClassName?: string
  textClassName?: string
}

function CarouselContent({
  items,
  className,
  titleClassName,
  textClassName,
}: CarouselContentProps) {
  const { active } = useCarouselContext()
  const currentItem = items[active] || {}

  return (
    <div className={cn(className)}>
      {currentItem.title && (
        <div className={cn(titleClassName)}>
          {currentItem.title}
        </div>
      )}
      {currentItem.text && (
        <div className={cn(textClassName)}>
          {currentItem.text}
        </div>
      )}
    </div>
  )
}

// Интерфейс для независимого view-компонента отображения текста
export interface CarouselContentViewProps {
  item: {
    title?: React.ReactNode
    text?: React.ReactNode
    [key: string]: any
  }
  className?: string
  titleClassName?: string
  textClassName?: string
}

// View-компонент для отображения текста вне контекста карусели
export function CarouselContentView({
  item,
  className,
  titleClassName,
  textClassName,
}: CarouselContentViewProps) {
  return (
    <div className={cn(className)}>
      {item.title && (
        <div className={cn(titleClassName)}>
          {item.title}
        </div>
      )}
      {item.text && (
        <div className={cn(textClassName)}>
          {item.text}
        </div>
      )}
    </div>
  )
}

// Интерфейс для компонента навигационных кнопок
export interface CarouselButtonsProps {
  // Компоненты кнопок
  prevButton?: React.ReactNode | ((props: { onClick: () => void, disabled: boolean }) => React.ReactNode)
  nextButton?: React.ReactNode | ((props: { onClick: () => void, disabled: boolean }) => React.ReactNode)
  // Классы и позиционирование
  className?: string
  buttonsPosition?: 'inside' | 'outside'
  buttonsAlign?: 'start' | 'center' | 'end' | 'sides'
  showOnlyOnHover?: boolean
  hideDisabled?: boolean
}

// Варианты стилей для обертки кнопок
const buttonsWrapperVariants = cva(
  'flex transition-opacity',
  {
    variants: {
      position: {
        inside: 'absolute z-10', // Внутри контейнера
        outside: 'mt-4', // Вне контейнера
      },
      align: {
        start: 'justify-start', // Выравнивание слева
        center: 'justify-center gap-4', // Выравнивание по центру
        end: 'justify-end', // Выравнивание справа
        sides: 'justify-between', // По краям
      },
    },
    compoundVariants: [
      { position: 'inside', align: 'sides', class: 'inset-y-0 inset-x-0 items-center px-4' },
      { position: 'inside', align: 'start', class: 'left-4 top-1/2 -translate-y-1/2 gap-2' },
      { position: 'inside', align: 'center', class: 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2' },
      { position: 'inside', align: 'end', class: 'right-4 top-1/2 -translate-y-1/2 gap-2' },
    ],
    defaultVariants: {
      position: 'inside',
      align: 'sides',
    },
  },
)

// Компонент для навигационных кнопок
function CarouselButtons({
  prevButton,
  nextButton,
  className,
  buttonsPosition = 'inside',
  buttonsAlign = 'sides',
  showOnlyOnHover = false,
  hideDisabled = false,
}: CarouselButtonsProps) {
  const { prev, next, canScrollPrev, canScrollNext } = useCarouselContext()

  // Если обе кнопки не предоставлены, не рендерим компонент
  if (!prevButton && !nextButton) {
    return null
  }

  // Проверка, нужно ли скрыть кнопку из-за невозможности скролла
  const shouldHidePrev = hideDisabled && !canScrollPrev
  const shouldHideNext = hideDisabled && !canScrollNext

  // Рендер кнопки предыдущего слайда
  const renderPrevButton = () => {
    if (!prevButton || shouldHidePrev)
      return null

    if (typeof prevButton === 'function') {
      return prevButton({ onClick: prev, disabled: !canScrollPrev })
    }

    return (
      <div
        onClick={prev}
        className={cn(
          'cursor-pointer',
          !canScrollPrev && 'opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!canScrollPrev}
      >
        {prevButton}
      </div>
    )
  }

  // Рендер кнопки следующего слайда
  const renderNextButton = () => {
    if (!nextButton || shouldHideNext)
      return null

    if (typeof nextButton === 'function') {
      return nextButton({ onClick: next, disabled: !canScrollNext })
    }

    return (
      <div
        onClick={next}
        className={cn(
          'cursor-pointer',
          !canScrollNext && 'opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!canScrollNext}
      >
        {nextButton}
      </div>
    )
  }

  return (
    <div
      className={cn(
        buttonsWrapperVariants({ position: buttonsPosition, align: buttonsAlign }),
        showOnlyOnHover && 'opacity-0 group-hover:opacity-100',
        className,
      )}
    >
      {renderPrevButton()}
      {renderNextButton()}
    </div>
  )
}

// Интерфейс для независимого view-компонента навигационных кнопок
export interface CarouselButtonsViewProps {
  // Обработчики событий
  onPrev: () => void
  onNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  // Компоненты кнопок
  prevButton?: React.ReactNode | ((props: { onClick: () => void, disabled: boolean }) => React.ReactNode)
  nextButton?: React.ReactNode | ((props: { onClick: () => void, disabled: boolean }) => React.ReactNode)
  // Классы и позиционирование
  className?: string
  buttonsPosition?: 'inside' | 'outside'
  buttonsAlign?: 'start' | 'center' | 'end' | 'sides'
  showOnlyOnHover?: boolean
  hideDisabled?: boolean
}

// View-компонент для навигационных кнопок, который можно использовать вне контекста
export function CarouselButtonsView({
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
  prevButton,
  nextButton,
  className,
  buttonsPosition = 'inside',
  buttonsAlign = 'sides',
  showOnlyOnHover = false,
  hideDisabled = false,
}: CarouselButtonsViewProps) {
  // Если обе кнопки не предоставлены, не рендерим компонент
  if (!prevButton && !nextButton) {
    return null
  }

  // Проверка, нужно ли скрыть кнопку из-за невозможности скролла
  const shouldHidePrev = hideDisabled && !canScrollPrev
  const shouldHideNext = hideDisabled && !canScrollNext

  // Рендер кнопки предыдущего слайда
  const renderPrevButton = () => {
    if (!prevButton || shouldHidePrev)
      return null

    if (typeof prevButton === 'function') {
      return prevButton({ onClick: onPrev, disabled: !canScrollPrev })
    }

    return (
      <div
        onClick={onPrev}
        className={cn(
          'cursor-pointer',
          !canScrollPrev && 'opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!canScrollPrev}
      >
        {prevButton}
      </div>
    )
  }

  // Рендер кнопки следующего слайда
  const renderNextButton = () => {
    if (!nextButton || shouldHideNext)
      return null

    if (typeof nextButton === 'function') {
      return nextButton({ onClick: onNext, disabled: !canScrollNext })
    }

    return (
      <div
        onClick={onNext}
        className={cn(
          'cursor-pointer',
          !canScrollNext && 'opacity-50 cursor-not-allowed',
        )}
        aria-disabled={!canScrollNext}
      >
        {nextButton}
      </div>
    )
  }

  return (
    <div
      className={cn(
        buttonsWrapperVariants({ position: buttonsPosition, align: buttonsAlign }),
        showOnlyOnHover && 'opacity-0 group-hover:opacity-100',
        className,
      )}
    >
      {renderPrevButton()}
      {renderNextButton()}
    </div>
  )
}

// Варианты стилей для обертки индикаторов
const indicatorWrapperVariants = cva(
  'flex gap-2 transition-all',
  {
    variants: {
      position: {
        inside: 'absolute z-10', // Внутри контейнера
        outside: 'mt-6', // Вне контейнера
      },
      align: {
        start: 'justify-start px-4', // Выравнивание слева
        center: 'justify-center', // Выравнивание по центру
        end: 'justify-end px-4', // Выравнивание справа
        stretch: 'justify-between px-4', // Растянуть на всю ширину
      },
    },
    compoundVariants: [
      // Компаунд-варианты для позиции индикаторов внутри контейнера
      { position: 'inside', align: 'start', class: 'left-0 bottom-6' },
      { position: 'inside', align: 'center', class: 'left-1/2 -translate-x-1/2 bottom-6' },
      { position: 'inside', align: 'end', class: 'right-0 bottom-6' },
      { position: 'inside', align: 'stretch', class: 'left-0 right-0 bottom-6' },
    ],
    defaultVariants: {
      position: 'outside',
      align: 'center',
    },
  },
)

// Интерфейс для независимого view-компонента индикаторов
export interface CarouselDotsViewProps {
  active: number
  count: number
  onChange: (index: number) => void
  show?: boolean
  position?: 'inside' | 'outside'
  align?: 'start' | 'center' | 'end' | 'stretch'
  className?: string
  activeClassName?: string
  inactiveClassName?: string
}

// View-компонент для индикаторов, который можно использовать вне контекста
export function CarouselDotsView({
  active,
  count,
  onChange,
  show = true,
  position = 'outside',
  align = 'center',
  className,
  activeClassName = 'bg-default',
  inactiveClassName = 'bg-default opacity-40',
}: CarouselDotsViewProps) {
  if (!show || count <= 1)
    return null

  return (
    <div
      className={cn(
        indicatorWrapperVariants({ position, align }),
        className,
      )}
      role="tablist"
      aria-label="Индикаторы карусели"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          onClick={() => onChange(idx)}
          className={cn(
            'h-[3px] rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-[#251D35]',
            idx === active ?
                cn('w-6', activeClassName) : // 24px для активного (w-6)
                cn('w-4', inactiveClassName), // 16px для неактивного (w-4)
          )}
          role="tab"
          tabIndex={0}
          aria-label={`Перейти к слайду ${idx + 1}`}
          aria-selected={idx === active}
        />
      ))}
    </div>
  )
}

// Компонент для точечных индикаторов внутри контекста карусели
interface CarouselDotsProps {
  className?: string
  count?: number
}

function CarouselDots({ className, count }: CarouselDotsProps) {
  const { active, onChange, indicatorOptions } = useCarouselContext()
  const { show, position, align, className: optionsClassName, activeClassName, inactiveClassName } = indicatorOptions

  // Получаем количество слайдов из контекста или из пропса
  const itemsCount = count || 0

  return (
    <CarouselDotsView
      active={active}
      count={itemsCount}
      onChange={onChange}
      show={show}
      position={position}
      align={align}
      className={cn(optionsClassName, className)}
      activeClassName={activeClassName}
      inactiveClassName={inactiveClassName}
    />
  )
}

// Составной компонент карусели
export const Carousel = {
  Root: CarouselRoot,
  Items: CarouselItems,
  Dots: CarouselDots,
  DotsView: CarouselDotsView, // Экспортируем view-компонент для использования вне контекста
  Content: CarouselContent,
  ContentView: CarouselContentView,
  Buttons: CarouselButtons, // Добавляем компонент кнопок
  ButtonsView: CarouselButtonsView, // Экспортируем view-компонент кнопок для использования вне контекста
}

// Для обратной совместимости сохраняем старые компоненты
export interface DefaultHeadlessCarouselProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: T[]
  renderSlide: (item: T, index: number) => React.ReactNode
  options?: UseCarouselOptions
  slideClassName?: string
  prevButton?: React.ReactNode
  nextButton?: React.ReactNode
  buttonsPosition?: 'inside' | 'outside'
  buttonsAlign?: 'start' | 'center' | 'end' | 'sides'
  showButtonsOnlyOnHover?: boolean
  hideDisabledButtons?: boolean
}

export function DefaultCustomizableCarousel<T>({
  items,
  renderSlide,
  options,
  className,
  slideClassName,
  prevButton,
  nextButton,
  buttonsPosition,
  buttonsAlign,
  showButtonsOnlyOnHover,
  hideDisabledButtons,
  ...divProps
}: DefaultHeadlessCarouselProps<T>) {
  // Флаг наличия кнопок
  const hasButtons = Boolean(prevButton || nextButton)

  return (
    <Carousel.Root options={options} className={cn('group', className)}>
      {/* Контейнер для слайдов */}
      <div className="relative">
        <Carousel.Items
          items={items.map((item, idx) => renderSlide(item, idx))}
          slideClassName={slideClassName}
          {...divProps}
        />

        {/* Кнопки навигации, если они предоставлены */}
        {hasButtons && (
          <Carousel.Buttons
            prevButton={prevButton}
            nextButton={nextButton}
            buttonsPosition={buttonsPosition}
            buttonsAlign={buttonsAlign}
            showOnlyOnHover={showButtonsOnlyOnHover}
            hideDisabled={hideDisabledButtons}
          />
        )}
      </div>

      {/* Индикаторы */}
      <Carousel.Dots count={items.length} />
    </Carousel.Root>
  )
}

// Старый headless компонент для обратной совместимости
interface HeadlessCarouselProps<T> {
  items: T[]
  options?: UseCarouselOptions
  renderItems: (state: UseCarouselState, items: T[]) => React.ReactNode
  renderControls?: (state: UseCarouselState, items: T[]) => React.ReactNode
  className?: string
}

export function HeadlessCarousel<T>({
  items,
  options,
  renderItems,
  renderControls,
  className,
}: HeadlessCarouselProps<T>) {
  const carouselState = useCarousel(options)

  return (
    <div className={cn('relative w-full', className)}>
      {renderItems(carouselState, items)}
      {renderControls && renderControls(carouselState, items)}
    </div>
  )
}
