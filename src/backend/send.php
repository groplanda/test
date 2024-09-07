<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $params = [
        'name' => htmlspecialchars($_POST['name']),
        'company_site' => htmlspecialchars($_POST['company_site']),
        'phone' => htmlspecialchars($_POST['phone']),
        'confirm' => htmlspecialchars($_POST['confirm'])
    ];
    
    $status = true;
    $response = [];

    if (!$params['confirm'] || $params['confirm'] !== '1') {
        $status = false;
        $response['errors']['confirm'] = 'Необходимо подтверждение';
    }
    
    if ($params['name'] === '') {
        $status = false;
        $response['errors']['name'] = 'Укажите имя';
    }

    if ($params['company_site'] === '') {
        $status = false;
        $response['errors']['company_site'] = 'Укажите сайт компании';
    }
    
    if (strlen($params['phone']) < 12) {
        $status = false;
        $response['errors']['phone'] = 'Заполните номер телефона';
    }
    

    if ($status) {
        $result = implode("\n", $params);
        file_put_contents('log_' . time() . '.txt', $result);
    }

        
    $response['status'] = $status;
    $response['data']['title'] = $status ? 'Вы успешно зарегистрировались' : 'Ошибка при регистрирации';
    
    echo json_encode($response);
}