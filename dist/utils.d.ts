export declare function wait(ms: number): Promise<void>;
export declare function getFromVersionFromPR(title: string): string;
export declare function getToVersionFromPR(title: string): string;
export declare function getLegacyAllowLeap(task: string): {
    allowLeap: string;
    allowPrerelease: boolean;
};
export declare function getAllowLeap(task: string, versions: string[]): {
    allowLeap: string;
    allowPrerelease: boolean;
};
