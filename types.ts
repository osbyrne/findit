// Basic file information type
export interface FileInfo {
    path: string;
    name: string;
    extension: string;
    size: number;
    created: Date;
    modified: Date;
    isDirectory: boolean;
}

// Search criteria type
export interface SearchCriteria {
    pattern: string;
    caseSensitive?: boolean;
    maxDepth?: number;
    excludePatterns?: string[];
    includeHidden?: boolean;
    minSize?: number;
    maxSize?: number;
    dateAfter?: Date;
    dateBefore?: Date;
}

// Search result type
export interface SearchResult {
    files: FileInfo[];
    totalFound: number;
    searchTime: number;
    errors?: string[];
}

// Search options type
export type SearchOptions = {
    recursive?: boolean;
    followSymlinks?: boolean;
    timeout?: number;
}