export ZSH="/Users/Justin/.oh-my-zsh"

# ZSH CONFIGURATION
ZSH_THEME="hyperzsh"
COMPLETION_WAITING_DOTS="true"

# PLUGINS
plugins=(
	# https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins-Overview

	# Productivity
	colored-man-pages
	colorize
	copydir
	copyfile
	history
	urltools
	web-search

	# FS Jumping
	z

	# Build Tools
	docker
	git
	gitfast
	git-extras	
	kubectl
	ng

	# MacOS
	osx

	# Misc
	#lol
	rand-quote

	# Other (not listed in that link)
	jsontools
	sudo

	# Custom
        zsh-autosuggestions
	zsh-syntax-highlighting
)
source $ZSH/oh-my-zsh.sh

# BASHRC & BASH_PROFILE
source ~/.bash_profile
source ~/.bashrc

# USER CONFIGURATION
export PATH="$PATH:/usr/local/bin"
export GOPATH=/Users/Justin/Go
export GOROOT=/usr/local/go
export ANDROID_HOME=/usr/local/opt/android-sdk
export PATH="$NPM_PACKAGES/bin:$PATH"
NPM_PACKAGES=/Users/Justin/.npm-packages
NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"
export PATH="$NPM_PACKAGES/bin:$PATH:/Library/Frameworks/Mono.framework/Versions/Current/bin/"
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
export PATH="$PATH:/usr/local/Cellar/android-sdk/24.4.1_1/tools/bin"
export PATH="$PATH:/Users/Justin/Go/bin"
export HELM_CHARTS_ROOT="/Users/Justin/IdeaProjects/helm"
export KOKAROOT=/Users/Justin/Koka

##### TMUX
TMUX_EXIT_CODE_NORMAL="0"
TMUX_EXIT_CODE_ESCAPE="1"

TMUX_EXIT_CODE_FILE=/tmp/tmux-exit-code

function _SET_TMUX_EXIT_CODE {
        echo $1 > $TMUX_EXIT_CODE_FILE
}

function _GET_TMUX_EXIT_CODE {
        _TMUX_EXIT_CODE=$(cat $TMUX_EXIT_CODE_FILE)
}

# Start Tmux
function join_tmux {
	if [[ ! $TERM =~ screen ]]; then
        	_SET_TMUX_EXIT_CODE $TMUX_EXIT_CODE_NORMAL
        	tmux
        	_GET_TMUX_EXIT_CODE
        	if [[ $_TMUX_EXIT_CODE == $TMUX_EXIT_CODE_NORMAL ]]; then
                	exit
        	elif [[ $_TMUX_EXIT_CODE == $TMUX_EXIT_CODE_ESCAPE ]]; then
                	# Continue execution in ZSH by doing nothing
                	_SET_TMUX_EXIT_CODE $TMUX_EXIT_CODE_NORMAL
        	else
                	alert "Uncrecognized tmux exit code" "$_TMUX_EXIT_CODE"
        	fi
	fi
}

# Use this function to escape tmux back to zsh
function escape_tmux {
        _SET_TMUX_EXIT_CODE $TMUX_EXIT_CODE_ESCAPE
        exit
}

# Create an alias and add it to the alias file
function hard-alias {
	echo "alias \"${1}\"" >> ~/.aliases
}
source ~/.aliases

# Redis
export PATH="$PATH:/Users/Justin/redis-5.0.3/src"
alias redisd='redis-server'
alias redis='redis-cli'

### ALIASES & FUNCTIONS ###
# Misc
function c {
	clear
	echo "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
}
alias b='base64 --decode'
function decode {
       echo "${1}" | base64 -D;
       echo ""
}
function encode {
       echo -n "${1}" | base64
}
function alert {
	osascript -e "display notification \"$3\" with title \"$1\" subtitle \"$2\""
}

alias g=grep
function beer_me {
	find . -name $1 2>/dev/null
}
alias accio=beer_me

function missmewiththat {
	grep -vE "${1}"
}

alias path="tr ':' '\n' <<< '$PATH'"

alias diff=colordiff

function kokacli {
	cd "${KOKAROOT}/bin"
	jake
	cd "${OLDPWD}"
}

function koka {
	KOKAFILE=$(pwd)$(echo "${1}" | cut -d . -f 2-) # Get full path from a relative path. Must start with "./"
	cd $KOKAROOT/bin
	./out/debug/koka-0.9.0-dev --execute $KOKAFILE
	cd $OLDPWD
}

# Stopwatch
function stopwatch {
	date && ${1} && date
}

function survey {
	echo "Beginning survey..."

	DEFAULT_SURVEY_SLEEP_DURATION=1
	if [[ -z ${SURVEY_SLEEP_DURATION} ]]; then
		SURVEY_SLEEP_DURATION=${DEFAULT_SURVEY_SLEEP_DURATION}
	fi

	DEFAULT_SURVEY_DISPLAY_STATUS=1
	if [[ -z ${SURVEY_DISPLAY_STATUS} ]]; then
		SURVEY_DISPLAY_STATUS=${DEFAULT_SURVEY_DISPLAY_STATUS}
	fi

	TEMP_FILE=$(mktemp)
	COUNT=1
	while true; do
		{
			echo "Surveying '${@}' every $SURVEY_SLEEP_DURATION second(s)... (You can change the sleep duration by overwriting the SURVEY_SLEEP_DURATION variable)"
			echo "Surveyed ${COUNT} time(s)"
			echo "----- Press CTRL + C to stop -----"
			echo ""
			eval ${@}
		} > ${TEMP_FILE}
		clear
		cat ${TEMP_FILE}

		echo ""
                echo "----- Press CTRL + C to stop -----"

		if [[ ${SURVEY_DISPLAY_STATUS} == 1 ]]; then
			echo -n "Sleeping..."
		fi

		sleep ${SURVEY_SLEEP_DURATION}

		if [[ ${SURVEY_DISPLAY_STATUS} == 1 ]]; then
			echo -ne "\\rSurveying..."
		fi

		COUNT=$((COUNT + 1))
	done
}

# IntelliJ
alias code="open -a 'IntelliJ IDEA'"
alias intellij="open -a 'IntelliJ IDEA'"

# Git
function find-branch-pattern {
	git branch --remote --merged origin/master | grep -v 'master' | cut -b 10- | grep ${1}
}
function delete-branch-pattern {
	git branch --remote --merged origin/master | grep -v 'master' | cut -b 10- | grep ${1} | xargs git push --delete origin
}

# Docker
alias docker-clear='docker-clear-containers && docker-clear-images'
alias docker-clear-containers='docker-container-ids | xargs docker rm'
alias docker-clear-containers-force='docker-container-ids | xargs docker rm --force'
alias docker-clear-force='docker-clear-containers-force && docker-clear-images-force'
alias docker-clear-images='docker-image-ids | xargs docker rmi'
alias docker-clear-images-force='docker-image-ids | xargs docker rmi --force'
alias docker-container-ids='docker ps -a | tail -n+2 | tr -s " " | cut -f 1 -d " " -s'
alias docker-image-ids='docker images | tail -n+2 | tr -s " " | cut -f 3 -d " " -s'
alias docker-repositories='docker images | tail -n+2 | tr -s " " | cut -f 1 -d " " -s'
alias docker-clear-nones='docker images -a | sed -E -n "s/<none> +<none> +([abcdef0-9]{12}).+/\1/p" | xargs docker rmi --force'

# IPC
alias ipcrm-m='ipcs | grep Justin | tr -s " " | cut -f 2 -d " " | xargs -I{} ipcrm -m {}'
alias ipcrm-q='ipcs | grep Justin | tr -s " " | cut -f 2 -d " " | xargs -I{} ipcrm -q {}'
alias ipcrm-s='ipcs | grep Justin | tr -s " " | cut -f 2 -d " " | xargs -I{} ipcrm -s {}'
alias ipcrm-a='ipcrm-m & ipcrm-q & ipcrm-s'

# Kubernetes
alias k='kubectl'

alias kg='k get'
alias kd='k describe'
alias ke='k edit'
alias kr='k delete'
alias kx='k exec'
alias kl='k logs'
alias kc='k create'
alias ka='k apply'
alias kf='k config'

alias kgp='kg pods'
alias kgr='kg rs'
alias kgd='kg deployments'
alias kgx='kg secrets'
alias kgn='kg namespaces'
alias kgs='kg services'
alias kgc='kg cm'
alias kgi='kg ingress'

alias kdp='kd pods'
alias kdr='kd rs'
alias kdd='kd deployments'
alias kdx='kd secrets'
alias kdn='kd namespaces'
alias kds='kd services'
alias kdc='kd cm'
alias kdi='kd ingress'

alias kep='ke pods'
alias ker='ke rs'
alias ked='ke deployments'
alias kex='ke secrets'
alias ken='ke namespaces'
alias kes='ke services'
alias kec='ke cm'
alias kei='ke ingress'

alias krp='kr pods'
alias krr='kr rs'
alias krd='kr deployments'
alias krx='kr secrets'
alias krn='kr namespaces'
alias krs='kr services'
alias krc='kr cm'
alias kri='kr ingress'

function kxs {
	kx -it -n "$1" "$2" sh
}
function kxb {
	kx -it -n "$1" "$2" bash
}

function kla {
	kl -n "$1" "$2"
}
function klf {
	kl -f -n "$1" "$2"
}

function kcf {
	kc -f "$1"
}

function kaf {
	ka -f "$1"
}

alias kfc='kf current-context'
function kfcs {
	kf set current-context "$1"
}

function watch {
	kgp -n $1 -w | grep $2
}

function bounce {
	PODS=$(kubectl get pod -n "${1}" | grep "${2}" | cut -d " " -f1 -)
	echo "These pods will be bounced:"
	echo $PODS
	read "response?Continue? [Y/n] "
	if [[ "$response" =~ ((^$)|(^[Yy]((e|E)+((s|S)+(h|H)?|(e|E)(t|T))?)?$)) ]]; then
		echo Bouncing pods...
		echo $PODS | xargs kubectl delete pod -n "${1}"
		echo Pods bounced, watching them spin back up (CTRL+C to stop watching)...
		watch "${1}" "${2}"
	else
		echo "Cancelling."
	fi
}

function kcurl {
	kubectl run --rm -n $1 mytest --image=yauritux/busybox-curl -it
}

# Weather
alias weather="curl wttr.in"

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# NOTES AND SCRATCH

# FIX THIS
# kubectl get secret kafkaapi -o yaml | grep -E "  [A-Z]" | sed 's/.*[A-Z_]*: \(.*\)/\1/' | xargs -I {} sh -c "echo '{}' | base64 --decode | xargs echo"

# To have nginx send you details back, use:
# add_header header "message: $var" always;
# "always" is needed so that the header is always sent regardless of response code.
# You can use any arbitrary header name, as long as it isn't already used like "Content-Type" or something.

export PATH=$HOME/bin:/usr/local/bin:$PATH


function d {
        echo "${1}" | b
        echo ""
}

source ~/.golangci-lint-completion
source ~/.private_zshrc

### USER DISPLAY (start of terminal prompt)
c
archey -c
# weather
echo "STAY VIGILANT, GREEN BEANS"
viu $HOME/Pictures/green-beans.jpeg -h 30
# quote
# w
TMUX_QUANTITY_SESSIONS=$(tmux ls 2>/dev/null | wc -l | awk '{$1=$1;print}')
if (( TMUX_QUANTITY_SESSIONS > 10 )); then
	echo "WARNING: More than 10 tmux sessions are running, you may want to clean them up."
fi

# Wasmer
export WASMER_DIR="/Users/Justin/.wasmer"
[ -s "$WASMER_DIR/wasmer.sh" ] && source "$WASMER_DIR/wasmer.sh"
export PATH="/usr/local/opt/mongodb-community@4.0/bin:$PATH"

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/Justin/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/Justin/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/Justin/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/Justin/google-cloud-sdk/completion.zsh.inc'; fi
