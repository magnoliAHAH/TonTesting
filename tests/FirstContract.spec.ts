import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { FirstContract } from '../wrappers/FirstContract';
import '@ton/test-utils';

describe('FirstContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let firstContract: SandboxContract<FirstContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        firstContract = blockchain.openContract(await FirstContract.fromInit(52359n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await firstContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: firstContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and firstContract are ready to use
    });

    it('shoule increase', async () => {
        const counterBefore = await firstContract.getCounter();

        console.log("Before: ", counterBefore)

        await firstContract.send(
            deployer.getSender(),{
                value: toNano("0.01")
            },
            "increment"
        )

        const counterAfter = await firstContract.getCounter();

        console.log("After: ", counterAfter)

        expect(counterBefore).toBeLessThan(counterAfter);
    });

    it('shoule increase with amount', async () => {
        const counterBefore = await firstContract.getCounter();
        const amount = 5n;
        console.log("Before: ", counterBefore)

        await firstContract.send(
            deployer.getSender(),{
                value: toNano("0.3")
            },
            {
                $$type: 'Add',
                amount: amount,
            }
        )

        const counterAfter = await firstContract.getCounter();

        console.log("After: ", counterAfter)

        expect(counterBefore).toBeLessThan(counterAfter);
    });
});
