export function generateTileSet(tileCount: number): string[] {
    if (tileCount !== 24) {
      throw new Error('Only 24 tiles (12 pairs) supported.')
    }
  
    const availableTiles = Array.from({ length: 12 }, (_, i) => `/tiles/tile${i + 1}.svg`)
  
    const selectedTiles = availableTiles.sort(() => Math.random() - 0.5)
  
    const tilePairs = [...selectedTiles, ...selectedTiles]
  
    return tilePairs.sort(() => Math.random() - 0.5)
  }
  