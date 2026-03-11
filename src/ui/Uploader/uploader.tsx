import React, { useCallback, useRef, useState } from 'react'

import { Icon } from '../Icon'
import { cn } from '@/lib/utils'

import { Button } from '../button'
import { Card } from '../card'
import { Progress } from '../Progress'
import { Typography } from '../Typography'

export interface UploadedFile {
  id: string
  name: string
  size?: number
  file: File
  status?: 'success' | 'error'
  error?: string
}

export interface UploaderProps {
  /** Принимаемые типы файлов */
  accept?: string
  /** Множественная загрузка файлов */
  multiple?: boolean
  /** Максимальный размер файла в байтах */
  maxSize?: number
  /** Коллбек при загрузке файлов */
  onUpload?: (files: File[]) => void
  /** Коллбек при удалении файла */
  onDelete?: (fileId: string) => void
  /** Коллбек при ошибке */
  onError?: (error: string) => void
  /** Направление flex контейнера */
  direction?: 'row' | 'col'
  /** Выравнивание flex контейнера  */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  /** Выравнивание flex элементов */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /** Отображение кнопки загрузки */
  isShowButton?: boolean
  /** Внешний список файлов */
  files?: UploadedFile[]
  /** Прогресс загрузки (0-100) */
  uploadProgress?: number
  /** Состояние загрузки */
  isUploading?: boolean
  /**
   * Показывать dropzone и когда уже есть загруженные файлы.
   * Полезно для "дозагрузки" при multiple-загрузке.
   */
  allowUploadMore?: boolean
  /** Дополнительный CSS класс */
  classNames?: {
    container?: string
    dropzone?: string
    dropzoneContainer?: string
    dropzoneText?: string
  }
  /** Текст для drag & drop области */
  dropzoneText?: React.ReactNode
  /** Текст кнопки */
  buttonText?: string
  /** Текст ошибки */
  errorText?: string
  /** Атрибут для тестов */
  'data-testId'?: string
}

const Uploader = React.forwardRef<HTMLDivElement, UploaderProps>(
  (
    {
      accept,
      multiple = false,
      maxSize,
      direction = 'row',
      justify = 'center',
      align = 'start',
      isShowButton = false,
      onUpload,
      onDelete,
      onError,
      files = [],
      uploadProgress = 0,
      isUploading = false,
      allowUploadMore = false,
      classNames,
      dropzoneText = 'Нажмите или перетащите сюда для загрузки',
      buttonText = 'Выбрать файл',
      errorText,
      'data-testId': dataTestId,
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dragCounterRef = useRef(0)

    const validateFile = useCallback(
      (file: File): string | null => {
        if (accept) {
          const acceptedTypes = accept.split(',').map(type => type.trim())
          const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
          const isValidType = acceptedTypes.some(
            type =>
              type === fileExtension ||
              (type.includes('*') && file.type.match(type.replace('*', '.*'))),
          )

          if (!isValidType) {
            return `Только ${acceptedTypes.join(' или ')} файлы`
          }
        }

        if (maxSize && file.size > maxSize) {
          const sizeMB = (maxSize / 1024 / 1024).toFixed(2)
          return `Максимальный размер файла ${sizeMB}MB`
        }

        return null
      },
      [accept, maxSize],
    )

    const handleFiles = useCallback(
      (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) {
          return
        }

        const newFiles = Array.from(fileList)

        for (const file of newFiles) {
          const error = validateFile(file)
          if (error) {
            onError?.(error)
            return
          }
        }

        onUpload?.(newFiles)
      },
      [onUpload, onError, validateFile],
    )

    const handleClick = useCallback(() => {
      fileInputRef.current?.click()
    }, [])

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)

        e.target.value = ''
      },
      [handleFiles],
    )

    const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current++
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true)
      }
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current--
      if (dragCounterRef.current === 0) {
        setIsDragging(false)
      }
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        dragCounterRef.current = 0

        const { files: droppedFiles } = e.dataTransfer
        handleFiles(droppedFiles)
      },
      [handleFiles],
    )

    const handleDeleteFile = useCallback(
      (fileId: string) => {
        onDelete?.(fileId)
      },
      [onDelete],
    )

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) {
        return '0 Bytes'
      }
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${Math.round(bytes / k ** i)} ${sizes[i]}`
    }

    return (
      <div
        ref={ref}
        className={cn('h-full w-full flex flex-col gap-2', classNames?.container)}
        data-testId={dataTestId}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Состояние 1, окно загрузки */}
        {(files.length === 0 || allowUploadMore) && (
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
              `flex flex-${direction} w-full ${files.length === 0 ? 'h-full' : 'h-auto'} items-${align} justify-${justify} border-border hover:border-primary cursor-pointer gap-1.5 rounded-xl border-1 border-dashed bg-white p-3 transition-colors duration-200`,
              isDragging && 'border-primary',
              classNames?.dropzone,
            )}
          >

            <div className={cn('flex flex-col items-center gap-2', classNames?.dropzoneContainer)}>
              <Typography variant="p2" className={cn('text-secondary font-cofo text-center', classNames?.dropzoneText)}>
                <Icon icon="AttachFileIcon" size={16} className="text-secondary align-top" />
                {' '}
                {dropzoneText}
              </Typography>
              {errorText && (
                <Typography variant="p1" className="text-negative font-cofo">
                  {errorText}
                </Typography>
              )}
            </div>
            {isShowButton && (
              <Button variant="dashed" size="md">
                {buttonText}
              </Button>
            )}
          </div>
        )}

        {/* Состояние 2, прогресс бар */}
        {isUploading && (
          <div className="flex flex-col gap-3">
            <Progress value={uploadProgress} />
          </div>
        )}

        {/* Состояние 3, список файлов */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((file) => {
              const hasError = file.status === 'error'
              const iconName = hasError ? 'FileErrorIcon' : 'FileSuccessIcon'

              return (
                <Card
                  key={file.id}
                  bordered
                  padding="sm"
                  radius="xl"
                  direction="row"
                  align="center"
                  justify="between"
                  className={cn('group transition-colors border-border')}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Icon
                      icon={iconName}
                      size={24}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Typography variant="p2" className="truncate">
                        {file.name}
                      </Typography>
                      {(hasError ? Boolean(file.error) : file.size !== undefined) && (
                        <Typography
                          variant="p2"
                          className={cn(
                            hasError ? 'text-destructive' : 'text-secondary',
                          )}
                        >
                          {hasError ? file.error : formatFileSize(file.size as number)}
                        </Typography>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="text"
                    size="sm"
                    iconOnly
                    icon="DeleteIcon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file.id)
                    }}
                    aria-label={`Удалить ${file.name}`}
                  />
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  },
)

Uploader.displayName = 'Uploader'

export { Uploader }
