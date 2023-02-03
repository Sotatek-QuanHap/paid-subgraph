import {
  Initialized,
  PoolCreated,
  RoleGranted,
  RoleRevoked,
  UpdatePoolImplementation
} from "../generated/PoolFactory/PoolFactory"
import { AdminEntity, BuyTokenHistory, ClosePoolHistory, PoolEntity, PoolSnapShotted, PoolUpdateTimeHistory, RedeemHistory, WithDrawHistory } from "../generated/schema"
import { Pool } from '../generated/templates';
import { BuyToken, RedeemTGEAmount, UpdateOpenPoolStatus, UpdateRoot, UpdateTime, WithdrawIDOToken, WithdrawPurchaseToken } from '../generated/templates/Pool/Pool';

export function handleInitialized(event: Initialized): void {}

export function handlePoolCreated(event: PoolCreated): void {
  Pool.create(event.params.pool);

  let pool = PoolEntity.load(event.params.pool.toHex());

  if (!pool) {
    pool = new PoolEntity(event.params.pool.toHex());
  }
  pool.pool_info_hash = event.params.poolInfoHash;
  pool.created_by = event.transaction.from;
  pool.tx_hash = event.transaction.hash.toHex();
  pool.created_at = event.block.timestamp;
  pool.block_number = event.block.number;
  pool.save();
}
export function handleRoleGranted(event: RoleGranted): void {
  let admin = AdminEntity.load(event.params.account.toHex());

  if (!admin) {
    admin = new AdminEntity(event.params.account.toHex());
  }

  admin.status = true;
  admin.tx_hash = event.transaction.hash;
  admin.updated_by = event.transaction.from;
  admin.created_at = event.block.timestamp;

  admin.save();
}

export function handleRoleRevoked(event: RoleRevoked): void {
  let admin = AdminEntity.load(event.params.account.toHex());

  if (!admin) {
    admin = new AdminEntity(event.params.account.toHex());
  }

  admin.status = false;
  admin.tx_hash = event.transaction.hash;
  admin.updated_by = event.transaction.from;
  admin.created_at = event.block.timestamp;

  admin.save();
}

export function handleUpdatePoolImplementation(
  event: UpdatePoolImplementation
): void {}

export function handleUpdateRoot(event: UpdateRoot): void {
  let pool_snap_shotted = PoolSnapShotted.load(event.transaction.hash.toHex())

  if (!pool_snap_shotted) {
    pool_snap_shotted = new PoolSnapShotted(event.transaction.hash.toHex())
  }

  let pool = PoolEntity.load(event.address.toHex());

  if (pool) {
    pool_snap_shotted.block_number = event.block.number;
    pool_snap_shotted.created_at = event.block.timestamp;
    pool_snap_shotted.pool_address = pool.id;
    pool_snap_shotted.save()
  }
}


export function handleUpdateTime(event: UpdateTime): void {
  let entity = PoolUpdateTimeHistory.load(event.transaction.hash.toHex())

  if (!entity) {
    entity = new PoolUpdateTimeHistory(event.transaction.hash.toHex())
  }

  let pool = PoolEntity.load(event.address.toHex());

  if (pool) {
    entity.block_number = event.block.number;
    entity.created_at = event.block.timestamp;
    entity.pool = pool.id;
    entity.communityCloseTime = event.params.communityCloseTime;
    entity.communityOpenTime = event.params.communityOpenTime;
    entity.whaleCloseTime = event.params.whaleCloseTime;
    entity.whaleOpenTime = event.params.whaleOpenTime;
    entity.save()
  }
}

export function handleBuyToken(event: BuyToken): void {
  let entity = BuyTokenHistory.load(event.transaction.hash.toHex());

  if (!entity) {
    entity = new BuyTokenHistory(event.transaction.hash.toHex())
  }

  let pool = PoolEntity.load(event.address.toHex());

  if (pool) {
    entity.block_number = event.block.number;
    entity.created_at = event.block.timestamp;
    entity.pool = pool.id;
    entity.user = event.transaction.from;
    entity.amount = event.params.purchaseAmount;
    entity.pool_type = event.params.poolType;
    entity.save()
  }
}

export function handleWithdrawIDOToken(event: WithdrawIDOToken): void {
  let entity = WithDrawHistory.load(event.transaction.hash.toHex());

  if (!entity) {
    entity = new WithDrawHistory(event.transaction.hash.toHex())
  }

  let pool = PoolEntity.load(event.address.toHex());

  if (pool) {
    entity.block_number = event.block.number;
    entity.created_at = event.block.timestamp;
    entity.pool = pool.id;
    entity.withdrawer = event.transaction.from;
    entity.withdraw_to = event.params.withdrawIDOTokenRecipient;
    entity.amount = event.params.remainAmount;
    entity.token = event.params.IDOToken;
    entity.type = 'withdraw_ido_token'
    entity.save()
  }
}

export function handleWithdrawPurchaseToken(event: WithdrawPurchaseToken): void {
  let entity = WithDrawHistory.load(event.transaction.hash.toHex());

  if (!entity) {
    entity = new WithDrawHistory(event.transaction.hash.toHex())
  }

  let pool = PoolEntity.load(event.address.toHex());

  if (pool) {
    entity.block_number = event.block.number;
    entity.created_at = event.block.timestamp;
    entity.pool = pool.id;
    entity.withdrawer = event.transaction.from;
    entity.withdraw_to = event.params.withdrawPurchaseTokenRecipient;
    entity.amount = event.params.purchaseAmount;
    entity.token = event.params.purchaseToken;
    entity.type = 'withdraw_purchase_token'
    entity.save()
  }
}

export function handleClosePool(event: UpdateOpenPoolStatus): void {
  let entity = ClosePoolHistory.load(event.transaction.hash.toHex());

  if (!entity) {
    entity = new ClosePoolHistory(event.transaction.hash.toHex())
  }

  let pool = PoolEntity.load(event.address.toHex());

  if (pool) {
    entity.block_number = event.block.number;
    entity.created_at = event.block.timestamp;
    entity.pool = pool.id;
    entity.closed_by = event.transaction.from;
    entity.save()
  }
}

export function handleRedeemTGE(event: RedeemTGEAmount): void {
  let entity = RedeemHistory.load(event.transaction.hash.toHex());

  if (!entity) {
    entity = new RedeemHistory(event.transaction.hash.toHex())
  }

  let pool = PoolEntity.load(event.address.toHex());

  if (pool) {
    entity.block_number = event.block.number;
    entity.created_at = event.block.timestamp;
    entity.pool = pool.id;
    entity.user = event.transaction.from;
    entity.amount = event.params.redeemAmount;
    entity.save()
  }
}