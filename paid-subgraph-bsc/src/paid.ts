import {
  Approval as ApprovalEvent,
  PAIDInitialized as PAIDInitializedEvent,
  Transfer as TransferEvent
} from "../generated/PAID/PAID"
import { Transfer } from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  
}

export function handlePAIDInitialized(event: PAIDInitializedEvent): void {
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(event.transaction.hash.toHex());
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.atBlock = event.block.number;
  entity.amount = event.params.value;
  entity.save();
}
