import "@polkadot/api-augment/polkadot";

import { ApiPromise } from "@polkadot/api/promise/Api";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { NeuronInfoLite, RawMetagraph, DelegateInfo, DelegateInfoRaw, SubnetInfo, Metagraph, DelegateExtras } from "./interfaces";
import { AccountId } from "@polkadot/types/interfaces";
import { ApiOptions } from "@polkadot/api/types";
import { Option } from "@polkadot/types";

export class BittensorApiPromise {
    api?: ApiPromise;

    public async create(
      endpoints: string | string[],
      options?: ApiOptions
    ) {

      const wsProvider = new WsProvider(endpoints);
      await wsProvider.connect();
      const api = await ApiPromise.create({
        types: {
          Balance: 'u64',
          PrometheusInfo: {
            block: 'u64', // --- Prometheus serving block.
            version: 'u32', // --- Prometheus version.
            ip: 'u128', // --- Prometheus u128 encoded ip address of type v6 or v4. serialized to string.
            port: 'u16', // --- Prometheus u16 encoded port.
            ip_type: 'u8', // --- Prometheus ip type, 4 for ipv4 and 6 for ipv6.
          },
          AxonInfo: {
            block: 'u64', // --- Axon serving block.
            version: 'u32', // --- Axon version
            ip: 'u128', // --- Axon u128 encoded ip address of type v6 or v4. serialized to string.
            port: 'u16', // --- Axon u16 encoded port.
            ip_type: 'u8', // --- Axon ip type, 4 for ipv4 and 6 for ipv6.
            protocol: 'u8', // --- Axon protocol. TCP, UDP, other.
            placeholder1: 'u8', // --- Axon proto placeholder 1.
            placeholder2: 'u8', // --- Axon proto placeholder 1.
          },
          NeuronInfo: {
            hotkey: 'AccountId',
            coldkey: 'AccountId',
            uid: 'Compact<u16>',
            netuid: 'Compact<u16>',
            active: 'bool',
            axon_info: 'AxonInfo',
            prometheus_info: 'PrometheusInfo',
            stake: 'Vec<(AccountId, Compact<u64>)>', // map of coldkey to stake on this neuron/hotkey (includes delegations)
            rank: 'Compact<u16>',
            emission: 'Compact<u64>',
            incentive: 'Compact<u16>',
            consensus: 'Compact<u16>',
            trust: 'Compact<u16>',
            validator_trust: 'Compact<u16>',
            dividends: 'Compact<u16>',
            last_update: 'Compact<u64>',
            validator_permit: 'bool',
            weights: 'Vec<(Compact<u16>, Compact<u16>)>', // Vec of (uid, weight)
            bonds: 'Vec<(Compact<u16>, Compact<u16>)>', // Vec of (uid, bond)
            pruning_score: 'Compact<u16>'
          },
          NeuronInfoLite: {
            hotkey: 'AccountId',
            coldkey: 'AccountId',
            uid: 'Compact<u16>',
            netuid: 'Compact<u16>',
            active: 'bool',
            axon_info: 'AxonInfo',
            prometheus_info: 'PrometheusInfo',
            stake: 'Vec<(AccountId, Compact<u64>)>', // map of coldkey to stake on this neuron/hotkey (includes delegations)
            rank: 'Compact<u16>',
            emission: 'Compact<u64>',
            incentive: 'Compact<u16>',
            consensus: 'Compact<u16>',
            trust: 'Compact<u16>',
            validator_trust: 'Compact<u16>',
            dividends: 'Compact<u16>',
            last_update: 'Compact<u64>',
            validator_permit: 'bool',
            pruning_score: 'Compact<u16>'
          },
          DelegateInfo: {
            delegate_ss58: 'AccountId',
            take: 'Compact<u16>',
            nominators: 'Vec<(AccountId, Compact<u64>)>', // map of nominator_ss58 to stake amount
            owner_ss58: 'AccountId',
            registrations: 'Vec<Compact<u16>>', // Vec of netuid this delegate is registered on
            validator_permits: 'Vec<Compact<u16>>', // Vec of netuid this delegate has validator permit on
            return_per_1000: 'Compact<u64>', // Delegators current daily return per 1000 TAO staked minus take fee
            total_daily_return: 'Compact<u64>', // Delegators current daily return
          },
          SubnetInfo: {
            netuid: 'Compact<u16>',
            rho: 'Compact<u16>',
            kappa: 'Compact<u16>',
            difficulty: 'Compact<u64>',
            immunity_period: 'Compact<u16>',
            validator_batch_size: 'Compact<u16>',
            validator_sequence_length: 'Compact<u16>',
            validator_epochs_per_reset: 'Compact<u16>',
            validator_epoch_length: 'Compact<u16>',
            max_allowed_validators: 'Compact<u16>',
            min_allowed_weights: 'Compact<u16>',
            max_weights_limit: 'Compact<u16>',
            scaling_law_power: 'Compact<u16>',
            synergy_scaling_law_power: 'Compact<u16>',
            subnetwork_n: 'Compact<u16>',
            max_allowed_uids: 'Compact<u16>',
            blocks_since_last_step: 'Compact<u64>',
            tempo: 'Compact<u16>',
            network_modality: 'Compact<u16>',
            network_connect: 'Vec<[u16; 2]>',
            emission_values: 'Compact<u64>',
            burn: 'Compact<u64>',
          },
          ...options?.types,
        },
        rpc: {
          neuronInfo: {
            getNeuronsLite: {
              description: 'Get neurons lite',
              params: [
                {
                  name: 'netuid',
                  type: 'u16',
                }
              ],
              type: 'Vec<u8>',
            },
            getNeuronLite: {
              description: 'Get neuron lite',
              params: [
                {
                  name: 'netuid',
                  type: 'u16',
                },
                {
                  name: 'uid',
                  type: 'u16',
                }
              ],
              type: 'Vec<u8>',
            },
            getNeurons: {
              description: 'Get neurons',
              params: [
                {
                  name: 'netuid',
                  type: 'u16',
                }
              ],
              type: 'Vec<u8>',
            },
            getNeuron: {
              description: 'Get neuron',
              params: [
                {
                  name: 'netuid',
                  type: 'u16',
                },
                {
                  name: 'uid',
                  type: 'u16',
                }
              ],
              type: 'Vec<u8>',
            },
          },
          delegateInfo: {
            getDelegates: {
              description: 'Get delegates info',
              params: [],
              type: 'Vec<u8>',
            },
          },
          subnetInfo: {
            getSubnetsInfo: {
              description: 'Get subnets info',
              params: [],
              type: 'Vec<u8>',
            },
            getSubnetInfo: {
              description: 'Get subnet info',
              params: [
                {
                  name: 'netuid',
                  type: 'u16',
                }
              ],
              type: 'Vec<u8>',
            },
          },
          ...options?.rpc,
        },
        provider: wsProvider,
      });

      this.api = api;
    }

    public assertApiInitialized(): void {
      if (this.api === undefined) {
        throw new Error("API is not initialized. Please call create() first");
      }
    }

    public async getNeurons(netuids: Array<number>): Promise<RawMetagraph> {
      this.assertApiInitialized();
      const api = this.api!;

      return new Promise<RawMetagraph>(async (resolve, reject) => {
        let results_map: RawMetagraph = {};
        for (let netuid of netuids) {
          try {
            let result_bytes = await (api.rpc as any).neuronInfo
              .getNeuronsLite(netuid)
          
            const result = api.createType<NeuronInfoLite>("Vec<NeuronInfoLite>", result_bytes);
            const neurons_info = result.toJSON() as any[] as NeuronInfoLite[];
            results_map[netuid] = neurons_info;
          } catch(err: any) {
              reject(err);
          }
        }

        resolve(results_map);
      });
    };

    public async getDelegateInfo(): Promise<DelegateInfo[]> {
      this.assertApiInitialized();
      const api = this.api!;

      const result_bytes = await (api.rpc as any).delegateInfo.getDelegates();
      const result = api.createType<DelegateInfoRaw>("Vec<DelegateInfo>", result_bytes);
      const delegate_info_raw: DelegateInfoRaw[] = result.toJSON() as any[] as DelegateInfoRaw[];
      
      const delegate_info = delegate_info_raw.map((delegate: DelegateInfoRaw) => {
        let nominators: [string, number][] = [];
        let total_stake = 0;
        for (let i = 0; i < delegate.nominators.length; i++) {
          const nominator = delegate.nominators[i];
          const staked = nominator[1];
          total_stake += staked;
          nominators.push([nominator[0].toString(), staked]);
        }
        return {
          take: delegate.take / (2**16 - 1), // Normalize take, which is a u16
          delegate_ss58: delegate.delegate_ss58.toString(),
          owner_ss58: delegate.owner_ss58.toString(),
          nominators,
          total_stake,
        };
      });

      return delegate_info;
    };

    public async getMetagraph(): Promise<Metagraph> {
      this.assertApiInitialized();
      const api = this.api!;
    
      const subnets_info_bytes = await ( api.rpc as any).subnetInfo.getSubnetsInfo();
      const subnets_info = api.createType<Option<SubnetInfo>>("Vec<Option<SubnetInfo>>", subnets_info_bytes);

      const netuids: Array<number> = (subnets_info as any)
        .toJSON()
        .map((subnetInfo: SubnetInfo) => {
          return subnetInfo.netuid;
        });

      let _meta: Metagraph = {};

      const result: RawMetagraph = await this.getNeurons(netuids);

      Object.entries(result).forEach(
        ([netuid, neurons]: [string, NeuronInfoLite[]]) => {
          let neurons_ = neurons.map((neuron: NeuronInfoLite) => {
            return {
              hotkey: neuron.hotkey.toString(),
              coldkey: neuron.coldkey.toString(),
              stake: Object.fromEntries(neuron.stake.map((stake: [AccountId, number]) => {
                return [stake[0].toString(), stake[1]];
              })),
              uid: neuron.uid,
            };
          });
          _meta[netuid] = neurons_;
        }
      );
      
      return _meta;
    };
}
