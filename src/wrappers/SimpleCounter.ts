import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type SimpleCounterTolkConfig = {
  id: number;
  counter: number;
};

export function simpleCounterTolkConfigToCell(config: SimpleCounterTolkConfig): Cell {
  return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32).endCell();
}

export const Opcodes = {
  OP_INCREASE: 0x7e8764ef,
};

export class SimpleCounter implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new SimpleCounter(address);
  }

  static createFromConfig(config: SimpleCounterTolkConfig, code: Cell, workchain = 0) {
    const data = simpleCounterTolkConfigToCell(config);
    const init = { code, data };
    return new SimpleCounter(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendIncrease(
    provider: ContractProvider,
    via: Sender,
    opts: {
      increaseBy: number;
      value: bigint;
      queryID?: number;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.OP_INCREASE, 32)
        .storeUint(opts.queryID ?? 0, 64)
        .storeUint(opts.increaseBy, 32)
        .endCell(),
    });
  }

  async getCounter(provider: ContractProvider) {
    const result = await provider.get("currentCounter", []);
    return result.stack.readNumber();
  }

  async getID(provider: ContractProvider) {
    const result = await provider.get("initialId", []);
    return result.stack.readNumber();
  }
}
