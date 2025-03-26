import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { Cell, toNano } from "@ton/core";
import { SimpleCounter } from "../wrappers/SimpleCounter";
import "@ton/test-utils";
import { readFileSync } from "fs";
import { join } from "path";

describe("SimpleCounter", () => {
  let code: Cell;

  beforeAll(async () => {
    const compilationInfo = JSON.parse(readFileSync(join(process.cwd(), "/build/simple_counter.json")).toString());
    code = Cell.fromBoc(Buffer.from((compilationInfo as any).codeBoc64, "base64"))[0];
  });

  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let simpleCounterTolk: SandboxContract<SimpleCounter>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    simpleCounterTolk = blockchain.openContract(
      SimpleCounter.createFromConfig(
        {
          id: 0,
          counter: 0,
        },
        code
      )
    );

    deployer = await blockchain.treasury("deployer");

    const deployResult = await simpleCounterTolk.sendDeploy(deployer.getSender(), toNano("0.05"));

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: simpleCounterTolk.address,
      deploy: true,
      success: true,
    });
  });

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and simpleCounterTolk are ready to use
  });

  it("should increase counter", async () => {
    const increaseTimes = 3;
    for (let i = 0; i < increaseTimes; i++) {
      console.log(`increase ${i + 1}/${increaseTimes}`);

      const increaser = await blockchain.treasury("increaser" + i);

      const counterBefore = await simpleCounterTolk.getCounter();

      console.log("counter before increasing", counterBefore);

      const increaseBy = Math.floor(Math.random() * 100);

      console.log("increasing by", increaseBy);

      const increaseResult = await simpleCounterTolk.sendIncrease(increaser.getSender(), {
        increaseBy,
        value: toNano("0.05"),
      });

      expect(increaseResult.transactions).toHaveTransaction({
        from: increaser.address,
        to: simpleCounterTolk.address,
        success: true,
      });

      const counterAfter = await simpleCounterTolk.getCounter();

      console.log("counter after increasing", counterAfter);

      expect(counterAfter).toBe(counterBefore + increaseBy);
    }
  });
});
