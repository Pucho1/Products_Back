pipeline{
    agent any

     environment {
        REPO_URL = 'https://github.com/Pucho1/Tienda-Outlet.git'
        SCANNER_SONAR = tool "SonarScanner"
        // NODE_ENV = "production"
     }


    stages{

      	stage('Checkout') {
        	steps {
				echo 'Checking out code...'
				sh 'which git' // <-- Línea de diagnóstico
				git branch: 'main',
				credentialsId: 'GitCredentials',
				url: REPO_URL
			}
		}

		stage('Build') {
			steps {
				echo 'Building...'
				sh 'npm ci || npm install'
			}
		}
		stage('Test') {
			steps {
				echo 'Testing...'
				sh 'npm run test'
			}
		}

		stage('SonarQube Analysis') {
			steps{
				echo 'Running SonarQube analysis...'
				withSonarQubeEnv('SonarQube'){
					sh "${SCANNER_SONAR}/bin/sonar-scanner"
				}
			}
		}

		stage('Snyk Test') {
			steps {
				withCredentials([string(credentialsId: 'Snik_credentials', variable: 'SNYK_TOKEN')]) {
				// snyk auth <tu_token> ----> Autentica Jenkins (el agente) con tu cuenta de Snyk usando tu token personal.
				// snyk test ----> Ejecuta un análisis de seguridad en el proyecto actual.
				sh '''
					# Instala Snyk sin guardarlo como dependencia
					npm install snyk --no-save

					 # Autentica con tu token
					npx snyk auth $SNYK_TOKEN

					# Ejecuta los análisis, pero sin romper el pipeline si fallan
					npx snyk test || true
					npx snyk monitor || true
					npx snyk test --severity-threshold=high || true
				'''
				}
			}
		}

		stage('Build Docker Image') {
			steps {
				script {
					docker.build("pucho1/back_outlet:${env.BUILD_NUMBER}")
					docker.build("pucho1/back_outlet:latest")
				}
			}
		}

		stage('Push Docker image') {
			steps {
				withCredentials([usernamePassword(credentialsId: 'dockerHub_credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
				script {
					sh """
						echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
						docker push $DOCKER_USER/back_outlet:${BUILD_NUMBER}
						docker push $DOCKER_USER/back_outlet:latest
					"""
				}
				}
			}
		}

		stage('Deploy') {
			steps {
				echo 'Deploying...'
				// Add your deploy steps here
			}
		}
    }
}