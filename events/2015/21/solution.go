package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
	"yod_aoc/utils/go/aoc_utils"
)

type PlayerStats struct {
	Health int
	Armor  int
	Damage int
	Spent  int
}

type ShopItem struct {
	Cost     int
	Damage   int
	Armor    int
	Category ShopCategory
}

type ShopCategory string

const (
	CategoryWeapon ShopCategory = "Weapon"
	CategoryArmor  ShopCategory = "Armor"
	CategoryRing   ShopCategory = "Ring"
)

func getShopItems() map[string]ShopItem {
	items := make(map[string]ShopItem)

	items["Dagger"] = ShopItem{Cost: 8, Damage: 4, Armor: 0, Category: CategoryWeapon}
	items["Shortsword"] = ShopItem{Cost: 10, Damage: 5, Armor: 0, Category: CategoryWeapon}
	items["Warhammer"] = ShopItem{Cost: 25, Damage: 6, Armor: 0, Category: CategoryWeapon}
	items["Longsword"] = ShopItem{Cost: 40, Damage: 7, Armor: 0, Category: CategoryWeapon}
	items["Greataxe"] = ShopItem{Cost: 74, Damage: 8, Armor: 0, Category: CategoryWeapon}

	// Armor
	items["Leather"] = ShopItem{Cost: 13, Damage: 0, Armor: 1, Category: CategoryArmor}
	items["Chainmail"] = ShopItem{Cost: 31, Damage: 0, Armor: 2, Category: CategoryArmor}
	items["Splitmail"] = ShopItem{Cost: 53, Damage: 0, Armor: 3, Category: CategoryArmor}
	items["Bandemail"] = ShopItem{Cost: 75, Damage: 0, Armor: 4, Category: CategoryArmor}
	items["Platemail"] = ShopItem{Cost: 102, Damage: 0, Armor: 5, Category: CategoryArmor}

	// Rings
	items["Damage +1"] = ShopItem{Cost: 25, Damage: 1, Armor: 0, Category: CategoryRing}
	items["Damage +2"] = ShopItem{Cost: 50, Damage: 2, Armor: 0, Category: CategoryRing}
	items["Damage +3"] = ShopItem{Cost: 100, Damage: 3, Armor: 0, Category: CategoryRing}
	items["Defense +1"] = ShopItem{Cost: 20, Damage: 0, Armor: 1, Category: CategoryRing}
	items["Defense +2"] = ShopItem{Cost: 40, Damage: 0, Armor: 2, Category: CategoryRing}
	items["Defense +3"] = ShopItem{Cost: 80, Damage: 0, Armor: 3, Category: CategoryRing}

	return items
}

func runBattle(player PlayerStats, enemy PlayerStats) bool {
	turn := 0
	playerDead := false
	enemyDead := false

	for !playerDead && !enemyDead {
		turn += 1

		if turn%2 == 0 {
			dealtDamage := math.Max(float64(enemy.Damage-player.Armor), float64(1))
			player.Health -= int(dealtDamage)

			if player.Health <= 0 {
				playerDead = true
			}
		} else {
			dealtDamage := math.Max(float64(player.Damage-enemy.Armor), float64(1))
			enemy.Health -= int(dealtDamage)

			if enemy.Health <= 0 {
				enemyDead = true
			}
		}
	}

	return playerDead
}

func getPossibleLoadouts(shopItems map[string]ShopItem, startingHealth int) []PlayerStats {
	possibleLoadouts := []PlayerStats{}

	weapons := make(map[string]ShopItem)
	armors := make(map[string]ShopItem)
	rings := make(map[string]ShopItem)

	for key, value := range shopItems {
		if value.Category == CategoryWeapon {
			weapons[key] = value
		} else if value.Category == CategoryArmor {
			armors[key] = value
		} else if value.Category == CategoryRing {
			rings[key] = value
		}
	}

	weaponLoadouts := []PlayerStats{}
	for _, weapon := range weapons {
		loadout := PlayerStats{
			Health: startingHealth,
			Damage: weapon.Damage,
			Armor:  0,
			Spent:  weapon.Cost,
		}
		weaponLoadouts = append(weaponLoadouts, loadout)
		possibleLoadouts = append(possibleLoadouts, loadout)
	}

	armorLoadouts := append([]PlayerStats{}, weaponLoadouts...)
	for _, armor := range armors {
		for _, weapon := range weaponLoadouts {
			loadout := PlayerStats{
				Health: startingHealth,
				Damage: weapon.Damage,
				Armor:  armor.Armor,
				Spent:  weapon.Spent + armor.Cost,
			}
			armorLoadouts = append(armorLoadouts, loadout)
			possibleLoadouts = append(possibleLoadouts, loadout)
		}
	}

	for _, ring := range rings {
		for _, armor := range armorLoadouts {
			possibleLoadouts = append(possibleLoadouts, PlayerStats{
				Health: startingHealth,
				Damage: armor.Damage + ring.Damage,
				Armor:  armor.Armor + ring.Armor,
				Spent:  armor.Spent + ring.Cost,
			})
		}
	}

	for name1, ring1 := range rings {
		for name2, ring2 := range rings {
			if name1 == name2 {
				continue
			}

			for _, armor := range armorLoadouts {
				possibleLoadouts = append(possibleLoadouts, PlayerStats{
					Health: startingHealth,
					Damage: armor.Damage + ring1.Damage + ring2.Damage,
					Armor:  armor.Armor + ring1.Armor + ring2.Armor,
					Spent:  armor.Spent + ring1.Cost + ring2.Cost,
				})
			}
		}
	}

	return possibleLoadouts
}

// ----------------------------------------------------------------------------------------------------
// | Part 1
// ----------------------------------------------------------------------------------------------------
func part1(input []string) int {
	Enemy := PlayerStats{Health: 0, Damage: 0, Armor: 0, Spent: 0}

	for _, line := range input {
		if len(line) == 0 {
			continue
		}

		if strings.Contains(line, "Hit Points") {
			health, err := strconv.Atoi(strings.Split(line, ": ")[1])
			if err != nil {
				panic(err)
			}
			Enemy.Health = health
		} else if strings.Contains(line, "Damage") {
			damage, err := strconv.Atoi(strings.Split(line, ": ")[1])
			if err != nil {
				panic(err)
			}
			Enemy.Damage = damage
		} else if strings.Contains(line, "Armor") {
			armor, err := strconv.Atoi(strings.Split(line, ": ")[1])
			if err != nil {
				panic(err)
			}
			Enemy.Armor = armor
		}
	}

	loadouts := getPossibleLoadouts(getShopItems(), 100)

	lowestSpend := 0
	initialSet := false
	for _, loadout := range loadouts {
		battleResult := runBattle(loadout, PlayerStats{Health: Enemy.Health, Damage: Enemy.Damage, Armor: Enemy.Armor, Spent: 0})

		if !battleResult {
			if lowestSpend > loadout.Spent || !initialSet {
				initialSet = true
				lowestSpend = loadout.Spent
			}
		}
	}

	return lowestSpend
}

// ----------------------------------------------------------------------------------------------------
// | Part 2
// ----------------------------------------------------------------------------------------------------
func part2(input []string) int {
	Enemy := PlayerStats{Health: 0, Damage: 0, Armor: 0, Spent: 0}

	for _, line := range input {
		if len(line) == 0 {
			continue
		}

		if strings.Contains(line, "Hit Points") {
			health, err := strconv.Atoi(strings.Split(line, ": ")[1])
			if err != nil {
				panic(err)
			}
			Enemy.Health = health
		} else if strings.Contains(line, "Damage") {
			damage, err := strconv.Atoi(strings.Split(line, ": ")[1])
			if err != nil {
				panic(err)
			}
			Enemy.Damage = damage
		} else if strings.Contains(line, "Armor") {
			armor, err := strconv.Atoi(strings.Split(line, ": ")[1])
			if err != nil {
				panic(err)
			}
			Enemy.Armor = armor
		}
	}

	loadouts := getPossibleLoadouts(getShopItems(), 100)

	highestSpend := 0
	initialSet := false
	for _, loadout := range loadouts {
		battleResult := runBattle(loadout, PlayerStats{Health: Enemy.Health, Damage: Enemy.Damage, Armor: Enemy.Armor, Spent: 0})

		if battleResult {
			if highestSpend < loadout.Spent || !initialSet {
				initialSet = true
				highestSpend = loadout.Spent
			}
		}
	}

	return highestSpend
}

// ----------------------------------------------------------------------------------------------------
// | Main Function
// ----------------------------------------------------------------------------------------------------
func main() {
	// Read the arguments
	args := os.Args[1:]
	var fileName string
	if len(args) > 0 {
		fileName = args[0]
	} else {
		fileName = "input.txt"
	}
	// Start the timer!
	startTime := time.Now()

	// Read the input to an array of strings
	path := aoc_utils.GetFilePath(2015, 21, fileName)
	content, err := aoc_utils.ReadInputAsArray(path)
	if err != nil {
		fmt.Println("Error reading input:", err)
		return
	}

	// Run the Parts
	p1Result := aoc_utils.MeasurePerformance(func() interface{} {
		return part1(content)
	})

	p2Result := aoc_utils.MeasurePerformance(func() interface{} {
		return part2(content)
	})

	// End the Timer!
	endTime := time.Now()
	duration := endTime.Sub(startTime)

	resultsForDay := aoc_utils.AOCDayResults{
		Year:     2015,
		Day:      21,
		Part1:    p1Result,
		Part2:    p2Result,
		Duration: duration.Nanoseconds(),
		Timestamp: aoc_utils.AOCTimestamp{
			Start: startTime.Format(time.RFC3339),
			End:   endTime.Format(time.RFC3339),
		},
	}
	jsonResults, _ := json.Marshal(resultsForDay)
	fmt.Println(string(jsonResults))
}
