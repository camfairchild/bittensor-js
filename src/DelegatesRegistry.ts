import { ApiPromise } from "@polkadot/api";
import { BittensorApiPromise } from "./BittensorApiPromise";
import { DelegateExtras, DelegateExtra, DelegateInfo } from "./interfaces";

export class DelegatesRegistry {    
    public async getDelegatesJson(): Promise<DelegateExtras> {
        const url = "https://raw.githubusercontent.com/opentensor/bittensor-delegates/master/public/delegates.json";
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    public async getDelegatesInfoWithExtras<ApiType extends ApiPromise>(api: BittensorApiPromise<ApiType>): Promise<Array<DelegateExtra & DelegateInfo>> {
        const delegatesInfo = await api.getDelegateInfo();
        const delegatesJson = await this.getDelegatesJson();

        const delegatesInfoWithExtras = delegatesInfo.map((delegateInfo: DelegateInfo) => {
            const delegateJson: DelegateExtra | undefined = delegatesJson[delegateInfo.delegate_ss58]
            return {
                ...delegateInfo,
                ...delegateJson
            }
        });

        return delegatesInfoWithExtras;
    }
}