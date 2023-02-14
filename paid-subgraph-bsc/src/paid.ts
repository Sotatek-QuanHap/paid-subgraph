import {
  Approval as ApprovalEvent,
  PAIDInitialized as PAIDInitializedEvent,
  Transfer as TransferEvent,
} from "../generated/PAID/PAID";
import { Transfer } from "../generated/schema";
import { UserBalance } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

const AddressZero = "0x0000000000000000000000000000000000000000";

export function handleApproval(event: ApprovalEvent): void {}

export function handlePAIDInitialized(event: PAIDInitializedEvent): void {}

export function handleTransfer(event: TransferEvent): void {
  if (event.params.from.toHexString() !== AddressZero) {
    let sender = UserBalance.load(event.params.from.toHexString());

    if (sender) {
      sender.balance = sender.balance.minus(event.params.value);
      sender.save();
    }
  }

  if (event.params.to.toHexString() !== AddressZero) {
    let receiver = UserBalance.load(event.params.to.toHexString());

    if (!receiver) {
      receiver = new UserBalance(event.params.to.toHexString());
      receiver.balance = BigInt.fromString("0");
    }

    if (receiver) {
      receiver.balance = receiver.balance.plus(event.params.value);
      receiver.save();
    }
  }
}
