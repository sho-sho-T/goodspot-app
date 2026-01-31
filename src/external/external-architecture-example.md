# External Layer Examples (Domain Template)

This document provides a concrete example you can copy when creating a new
domain in `frontend/src/external`. It assumes a new domain named `invoice`.

## 1. Directory shape

```
external/
├── domain/invoice/
│   ├── invoice.ts
│   ├── invoice-id.ts
│   ├── invoice.repository.ts
│   ├── events/
│   │   └── invoice-issued.event.ts
│   └── index.ts
├── dto/invoice/
│   ├── invoice.dto.ts
│   ├── invoice.command.dto.ts
│   ├── invoice.query.dto.ts
│   └── index.ts
├── service/invoice/
│   ├── InvoiceService.ts
│   └── InvoiceWorkflowService.ts
├── repository/db/
│   └── InvoiceRepository.ts
└── handler/invoice/
    ├── command.server.ts
    ├── command.action.ts
    ├── query.server.ts
    ├── query.action.ts
    ├── shared.ts
    └── index.ts
```

## 2. Domain (entity + repository interface)

```ts
// external/domain/invoice/invoice.ts
import { InvoiceId } from './invoice-id'
import { DomainEvent } from '../shared/events'

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
}

export class Invoice {
  private domainEvents: DomainEvent[] = []

  private constructor(
    private readonly id: InvoiceId,
    private status: InvoiceStatus,
    private readonly customerId: string,
    private readonly totalAmount: number,
    private readonly issuedAt: Date | null
  ) {}

  static create(customerId: string, totalAmount: number): Invoice {
    return new Invoice(
      InvoiceId.generate(),
      InvoiceStatus.DRAFT,
      customerId,
      totalAmount,
      null
    )
  }

  issue(now = new Date()): void {
    if (this.status !== InvoiceStatus.DRAFT) {
      throw new Error('Only draft invoices can be issued')
    }
    this.status = InvoiceStatus.ISSUED
    this.domainEvents.push(/* InvoiceIssuedEvent */)
  }
}
```

```ts
// external/domain/invoice/invoice.repository.ts
import { Repository } from '../shared/repository'
import { Invoice } from './invoice'
import { InvoiceId } from './invoice-id'
import { InvoiceStatus } from './invoice'

export interface InvoiceRepository extends Repository<Invoice, InvoiceId> {
  findByCustomerId(customerId: string): Promise<Invoice[]>
  countByStatus(status: InvoiceStatus): Promise<number>
}
```

## 3. DTOs (command/query schemas)

```ts
// external/dto/invoice/invoice.command.dto.ts
import { z } from 'zod'
import type { InvoiceDto } from './invoice.dto'

export const createInvoiceSchema = z.object({
  customerId: z.string(),
  totalAmount: z.number().positive(),
})

export type CreateInvoiceInput = z.input<typeof createInvoiceSchema>

export type InvoiceCommandResponse = {
  success: boolean
  error?: string
  invoice?: InvoiceDto
}
```

```ts
// external/dto/invoice/invoice.query.dto.ts
import { z } from 'zod'
import type { InvoiceDto } from './invoice.dto'

export const invoiceDetailSchema = z.object({
  invoiceId: z.string().uuid(),
})

export type InvoiceDetailInput = z.input<typeof invoiceDetailSchema>

export type InvoiceDetailResponse = {
  success: boolean
  error?: string
  invoice?: InvoiceDto
}
```

## 4. Repository implementation

```ts
// external/repository/db/InvoiceRepository.ts
import { db } from '@/external/client/db/client'
import { invoices } from '@/external/client/db/schema'
import {
  InvoiceRepository as IInvoiceRepository,
  InvoiceId,
} from '@/external/domain'

export class InvoiceRepository implements IInvoiceRepository {
  async findById(id: InvoiceId) {
    const rows = await db.select().from(invoices).where(/* ... */)
    return rows[0] ? this.mapToDomain(rows[0]) : null
  }

  async save(entity: unknown) {
    // Insert or update based on entity state
  }

  private mapToDomain(row: unknown) {
    // Convert DB row -> Invoice.restore(...)
  }
}
```

## 5. Service + handler wiring

```ts
// external/handler/invoice/shared.ts
import { InvoiceRepository } from '@/external/repository'
import { InvoiceWorkflowService } from '@/external/service/invoice/InvoiceWorkflowService'

export const invoiceRepository = new InvoiceRepository()
export const invoiceWorkflowService = new InvoiceWorkflowService()

export function mapInvoiceToDto(/* ... */) {
  return {
    id: '...',
  }
}
```

```ts
// external/handler/invoice/command.server.ts
import 'server-only'

import { createInvoiceSchema } from '@/external/dto/invoice'
import { invoiceWorkflowService, mapInvoiceToDto } from './shared'

export async function createInvoiceServer(input: unknown) {
  const validated = createInvoiceSchema.parse(input)
  const invoice = await invoiceWorkflowService.createInvoice(validated)
  return { success: true, invoice: mapInvoiceToDto(invoice) }
}
```

```ts
// external/handler/invoice/command.action.ts
'use server'

import { createInvoiceServer } from './command.server'

export async function createInvoiceAction(input: unknown) {
  return createInvoiceServer(input)
}
```

## 6. Feature usage

```ts
import { createInvoiceAction } from '@/external/handler/invoice'

await createInvoiceAction({ customerId, totalAmount })
```

## 7. Checklist

- `features/` only imports handler + DTO types.
- `handler/*` validates inputs with Zod.
- `domain/*` contains no DB or Next.js dependencies.
- `repository/*` maps between DB rows and domain entities.
- `service/*` orchestrates transactions and cross-domain side effects.
