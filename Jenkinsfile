pipeline {
    agent {
        docker {
            image 'cypress/base:12.16.1' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Install Dependencies') { 
            steps {
                sh 'npm ci'
                sh 'npm run cy:verify'
            }
        }
        stage('Build') { 
            steps {
                sh 'npm run build'
            }
        }
        stage('Test') { 
            steps {
                sh 'npm run ci:cy-run'
            }
        }
    }
}