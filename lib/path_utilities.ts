import { MelonPath } from "./types";

export interface MelonQueryParams {
  [key: string]: any;
}

class PathUtilities {
  path: string;

  paramsIndex: Array<number>;

  counterIndex: Array<number>;

  constructor(path: string) {
    this.path = path;
    this.paramsIndex = [];
    this.counterIndex = [];
  }

  hasQueryParams(): boolean {
    return this.path.includes(":");
  }

  slicedRoute(): Array<string> {
    return this.path.split("/");
  }

  extractStartsWith(): string {
    return this.path.slice(0, this.path.indexOf(":") - 1);
  }

  extractQueryTags(): Array<string> {
    const queryTags: Array<string> = [];
    const splitter = this.path.split("/");
    splitter.forEach((word, index) => {
      if (word.startsWith(":")) {
        this.paramsIndex.push(index);
        queryTags.push(word);
      } else {
        this.counterIndex.push(index);
      }
    });
    return queryTags;
  }

  extractParamIndex(): Array<number> {
    return this.paramsIndex;
  }

  createMelonPath(): MelonPath {
    return {
      startsWith: this.extractStartsWith(),
      params: this.extractQueryTags(),
      paramsIndex: this.extractParamIndex(),
      counterIndex: this.counterIndex,
      route: this.path,
      routeSliced: this.slicedRoute(),
    };
  }

  static verifyPathForQueryParams(
    rawPath: string,
    melonPath: MelonPath
  ): boolean {
    if (!rawPath.startsWith(melonPath.startsWith)) {
      return false;
    }
    const pathSlicer = rawPath.split("/");
    // eslint-disable-next-line no-restricted-syntax
    for (const value of melonPath.counterIndex) {
      if (pathSlicer[value] !== melonPath.routeSliced[value]) {
        return false;
      }
    }
    return true;
  }

  static extractQueryParamsFromPath(
    rawPath: string,
    melonPath: MelonPath
  ): MelonQueryParams {
    const mqp: MelonQueryParams = {};
    const pathSlicer = rawPath.split("/");
    melonPath.paramsIndex.forEach((value) => {
      mqp[melonPath.routeSliced[value].slice(1)] = pathSlicer[value];
    });
    return mqp;
  }
}

export default PathUtilities;
