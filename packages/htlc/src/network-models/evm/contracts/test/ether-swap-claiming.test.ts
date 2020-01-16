import { EtherSwapInstance } from '../types/truffle-contracts';
import { config, etherToWei, expect } from './lib';

// tslint:disable:variable-name
const Swap = artifacts.require('EtherSwap');

contract('EtherSwap - Claiming', accounts => {
  const [validArgs] = config.valid;
  const invalidArgs = config.invalid;
  let swapInstance: EtherSwapInstance;
  before(async () => {
    swapInstance = await Swap.deployed();
    await swapInstance.fund(
      {
        orderUUID: validArgs.orderUUID,
        paymentHash: validArgs.paymentHash,
      },
      {
        from: accounts[1],
        value: etherToWei(0.01),
      },
    );
  });

  it('should revert if the order does not exist', async () => {
    await expect(
      swapInstance.claim({
        orderUUID: invalidArgs.orderUUID,
        paymentPreimage: validArgs.paymentPreimage,
      }),
    ).to.be.rejectedWith(/VM Exception while processing transaction: revert/);
  });

  it('should revert if the preimage is incorrect', async () => {
    await expect(
      swapInstance.claim({
        orderUUID: validArgs.orderUUID,
        paymentPreimage: invalidArgs.paymentPreimage,
      }),
    ).to.be.rejectedWith(/VM Exception while processing transaction: revert/);
  });

  it('should succeed if the args are valid', async () => {
    const res = await swapInstance.claim({
      orderUUID: validArgs.orderUUID,
      paymentPreimage: validArgs.paymentPreimage,
    });
    expect(res.logs).to.shallowDeepEqual([
      {
        event: 'OrderClaimed',
        args: {
          orderUUID: validArgs.orderUUID,
        },
      },
    ]);
  });
});
