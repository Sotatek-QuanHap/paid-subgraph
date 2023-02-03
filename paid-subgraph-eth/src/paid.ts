import { BigInt } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  PAIDInitialized as PAIDInitializedEvent,
  Transfer as TransferEvent
} from "../generated/PAID/PAID"
import { UserBalance } from "../generated/schema";
const AddressZero = '0x0000000000000000000000000000000000000000';

export function handleApproval(event: ApprovalEvent): void {}

export function handlePAIDInitialized(event: PAIDInitializedEvent): void {}

export function handleTransfer(event: TransferEvent): void {
  // const paid_contract = PAID.bind(event.address);
  // const user_balance = paid_contract.balanceOf(event.params.to);

  if (event.params.from.toHexString() !== AddressZero) {
    let sender = UserBalance.load(event.params.from.toHexString());

    if (sender) {
      sender.balance = sender.balance.minus(event.params.value);
      sender.save()
    }
  }

  if (event.params.to.toHexString() !== AddressZero) {
    let receiver = UserBalance.load(event.params.to.toHexString());

    if (!receiver) {
      receiver = new UserBalance(event.params.to.toHexString());
      receiver.balance = BigInt.fromString('0');
    }

    if (receiver) {
      receiver.balance = receiver.balance.plus(event.params.value);
      receiver.save()
    }
  }

}
