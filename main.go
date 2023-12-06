package main

import (
	"flag"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	aw "github.com/deanishe/awgo"
	"go.deanishe.net/fuzzy"
)

var (
	cacheName  = "repos.json"
	launchType string
	sopts      []fuzzy.Option
	wf         *aw.Workflow
)

func init() {
	flag.StringVar(&launchType, "type", "vscode", "")
	sopts = []fuzzy.Option{
		fuzzy.AdjacencyBonus(10.0),
		fuzzy.LeadingLetterPenalty(-0.1),
		fuzzy.MaxLeadingLetterPenalty(-3.0),
		fuzzy.UnmatchedLetterPenalty(-0.5),
	}
	wf = aw.New(aw.HelpURL("http://www.deanishe.net/"),
		aw.MaxResults(200),
		aw.SortOptions(sopts...))
}

func main() {
	wf.Run(run)
}

func run() {
	wf.Args()
	flag.Parse()

	var query = ""
	if args := flag.Args(); len(args) > 0 {
		query = args[0]
	}
	log.Printf("query:%s", query)

	repos, err := listReposIfNeeded()
	if err != nil {
		wf.FatalError(err)
	}
	setItems(repos)

	if query != "" {
		wf.Filter(query)
	}
	wf.SendFeedback()
}

func listReposIfNeeded() ([]string, error) {
	var repos []string = nil
	cacheExists := wf.Cache.Exists(cacheName)
	if !cacheExists || wf.Cache.Expired(cacheName, time.Second*10) {
		log.Println("load")
		var err error
		repos, err = listRepos()
		if err != nil {
			return nil, err
		}
		wf.Cache.StoreJSON(cacheName, repos)
	} else if cacheExists {
		log.Println("use cache")
		if err := wf.Cache.LoadJSON(cacheName, &repos); err != nil {
			return nil, err
		}
	}
	return repos, nil
}

func listRepos() ([]string, error) {
	cmd := exec.Command("ghq", "list", "-p")
	cmd.Env = append(os.Environ(), "PATH=/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin")
	list, err := cmd.Output()
	if err != nil {
		return nil, err
	}
	return strings.Split(string(list), "\n"), nil
}

func setItems(repos []string) {
	for _, repo := range repos {
		_, name := filepath.Split(repo)
		item := wf.NewItem(name)
		item.Subtitle(repo)
		item.Arg(repo)
		item.Valid(true)
		switch launchType {
		case "vscode":
			item.Icon(&aw.Icon{
				Value: "/Applications/Visual Studio Code.app",
				Type:  aw.IconTypeFileIcon,
			})
		case "idea":
			item.Icon(&aw.Icon{
				Value: "~/Applications/JetBrains Toolbox/IntelliJ IDEA Ultimate Release.app",
				Type:  aw.IconTypeFileIcon,
			})
		case "terminal":
			item.Icon(&aw.Icon{
				Value: "/Applications/iTerm.app",
				Type:  aw.IconTypeFileIcon,
			})
		}
	}
}
