def readInputAsArray(file: str) -> list[str]:
  # Read the file
  with open(file, 'r') as file:
    return file.readlines()