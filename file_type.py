from enum import Enum


class FileType(Enum):
	FILE = 1
	DIRECTORY = 2
	SYMLINK = 3
	UNKNOWN = 4