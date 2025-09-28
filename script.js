document.addEventListener('DOMContentLoaded', () => {
    // 페이지 요소 가져오기
    const firstPage = document.getElementById('first-page');
    const testPage = document.getElementById('test-page');
    const loadingPage = document.getElementById('loading-page');
    const resultPage = document.getElementById('result-page');
    const startBtn = document.getElementById('start-btn');
    const symptomsContainer = document.getElementById('symptoms-container');
    const resultBtn = document.getElementById('result-btn');
    const rank1 = document.getElementById('rank-1');
    const rank2 = document.getElementById('rank-2');
    const rank3 = document.getElementById('rank-3');
    const rank1Container = document.getElementById('rank-1-container');
    const rank2Container = document.getElementById('rank-2-container');
    const rank3Container = document.getElementById('rank-3-container');

    // 증상 목록 및 강도
    const symptomCategories = {
        "발열": ["미열 (38°C 미만)", "고열 (38°C 이상)"],
        "기침": ["마른 기침", "가래 기침"],
        "인후통": ["경미한 인후통", "심한 인후통"],
        "몸살": ["경미한 몸살", "심한 근육통"],
        "두통": ["경미한 두통", "심한 두통"],
        "콧물/코막힘": ["콧물", "코막힘"],
        "피로감": ["가벼운 피로감", "극심한 피로감"],
        "소화기 증상": ["구역/구토", "설사", "복통"],
        "알레르기": ["재채기", "눈/코 가려움"],
        "호흡기 증상": ["숨가쁨", "가슴 답답함"],
        "피부 증상": ["발진", "가려움"]
    };

    // 증상별 가중치 (1-10점 척도, 증상이 질병에 얼마나 특징적인지에 따라 설정)
    const symptomWeights = {
        "미열 (38°C 미만)": 4, "고열 (38°C 이상)": 8,
        "마른 기침": 5, "가래 기침": 3,
        "경미한 인후통": 3, "심한 인후통": 6,
        "경미한 몸살": 4, "심한 근육통": 7,
        "경미한 두통": 2, "심한 두통": 5,
        "콧물": 6, "코막힘": 5,
        "가벼운 피로감": 3, "극심한 피로감": 7,
        "구역/구토": 6, "설사": 6, "복통": 5,
        "재채기": 7, "눈/코 가려움": 7,
        "숨가쁨": 9, "가슴 답답함": 8,
        "발진": 5, "가려움": 4
    };

    // 질병 데이터 (더욱 정교해진 증상 목록)
    const diseases = {
        "감기": ["미열 (38°C 미만)", "가래 기침", "경미한 인후통", "콧물", "코막힘", "재채기", "가벼운 피로감"],
        "독감": ["고열 (38°C 이상)", "마른 기침", "심한 인후통", "심한 근육통", "심한 두통", "극심한 피로감"],
        "편도염": ["고열 (38°C 이상)", "심한 인후통", "구역/구토", "경미한 두통"],
        "장염": ["구역/구토", "설사", "복통", "미열 (38°C 미만)", "가벼운 피로감"],
        "알레르기성 비염": ["재채기", "콧물", "코막힘", "눈/코 가려움"],
        "천식": ["숨가쁨", "가슴 답답함", "마른 기침", "코막힘"],
        "식중독": ["구역/구토", "설사", "복통", "미열 (38°C 미만)"],
        "편두통": ["심한 두통", "구역/구토"],
        "아토피": ["가려움", "발진", "가벼운 피로감"]
    };

    // 첫 페이지에서 '검사하기' 버튼 클릭 시
    startBtn.addEventListener('click', () => {
        firstPage.classList.remove('active');
        testPage.classList.add('active');
    });

    // 증상 버튼 동적 생성
    Object.keys(symptomCategories).forEach(category => {
        const header = document.createElement('h4');
        header.textContent = category;
        symptomsContainer.appendChild(header);

        symptomCategories[category].forEach(symptom => {
            const button = document.createElement('button');
            button.className = 'symptom-btn';
            button.textContent = symptom;
            button.dataset.symptom = symptom;
            symptomsContainer.appendChild(button);
        });
    });

    let selectedSymptoms = new Set();

    // 증상 버튼 클릭 이벤트
    symptomsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('symptom-btn')) {
            target.classList.toggle('selected');
            const symptom = target.dataset.symptom;

            if (target.classList.contains('selected')) {
                selectedSymptoms.add(symptom);
            } else {
                selectedSymptoms.delete(symptom);
            }

            resultBtn.disabled = selectedSymptoms.size === 0;
        }
    });

    // '결과 보기' 버튼 클릭 시
    resultBtn.addEventListener('click', () => {
        if (!resultBtn.disabled) {
            // 로딩 페이지 활성화
            testPage.classList.remove('active');
            loadingPage.classList.add('active');

            // 2초 후 결과 페이지 표시
            setTimeout(() => {
                const diseaseScores = [];

                for (const disease in diseases) {
                    const diseaseSymptoms = diseases[disease];
                    let weightedScore = 0;
                    let maxPossibleScore = 0;

                    diseaseSymptoms.forEach(symptom => {
                        if (symptomWeights.hasOwnProperty(symptom)) {
                            maxPossibleScore += symptomWeights[symptom];
                            if (selectedSymptoms.has(symptom)) {
                                weightedScore += symptomWeights[symptom];
                            }
                        }
                    });

                    let score = 0;
                    if (maxPossibleScore > 0) {
                        score = (weightedScore / maxPossibleScore);
                    }

                    diseaseScores.push({ name: disease, score: score });
                }

                diseaseScores.sort((a, b) => b.score - a.score);

                const totalScore = diseaseScores.reduce((sum, item) => sum + item.score, 0);

                rank1Container.style.display = 'none';
                rank2Container.style.display = 'none';
                rank3Container.style.display = 'none';

                if (diseaseScores.length > 0 && totalScore > 0) {
                    const rank1Score = (diseaseScores[0].score / totalScore) * 100;
                    rank1Container.style.display = 'flex';
                    rank1.textContent = `${diseaseScores[0].name} (${rank1Score.toFixed(1)}%)`;

                    if (diseaseScores.length > 1 && diseaseScores[1].score > 0) {
                        const rank2Score = (diseaseScores[1].score / totalScore) * 100;
                        rank2Container.style.display = 'flex';
                        rank2.textContent = `${diseaseScores[1].name} (${rank2Score.toFixed(1)}%)`;
                    }

                    if (diseaseScores.length > 2 && diseaseScores[2].score > 0) {
                        const rank3Score = (diseaseScores[2].score / totalScore) * 100;
                        rank3Container.style.display = 'flex';
                        rank3.textContent = `${diseaseScores[2].name} (${rank3Score.toFixed(1)}%)`;
                    }
                } else {
                    rank1Container.style.display = 'flex';
                    rank1.textContent = '일치하는 질병이 없습니다.';
                }

                loadingPage.classList.remove('active');
                resultPage.classList.add('active');
            }, 2000); // 2초 (2000ms) 로딩 시간
        }
    });

});
