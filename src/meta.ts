// @formatter:off
import {getGitTag} from "./version.ts" with {type: "macro"};
// @formatter:on


export const VERSION = getGitTag();

