'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div
    className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
)

export const CardHeader: React.FC<CardHeaderProps> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
)

export const CardTitle: React.FC<CardTitleProps> = ({ className, ...props }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
)

export const CardDescription: React.FC<CardDescriptionProps> = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)

export const CardContent: React.FC<CardContentProps> = ({ className, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
)

export const CardFooter: React.FC<CardFooterProps> = ({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
)