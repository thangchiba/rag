import { useLogin, useRegister } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'umi';

import styles from './index.less';

const Login = () => {
  const [title, setTitle] = useState('login');
  const navigate = useNavigate();
  const { login, loading: signLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const loading = signLoading || registerLoading;

  const changeTitle = () => {
    setTitle((title) => (title === 'login' ? 'register' : 'login'));
  };
  const [form] = Form.useForm();

  useEffect(() => {
    form.validateFields(['nickname']);
  }, [form]);

  const onCheck = async () => {
    try {
      const params = await form.validateFields();
      const rsaPassWord = rsaPsw(params.password) as string;

      if (title === 'login') {
        const code = await login({
          email: `${params.email}`.trim(),
          password: rsaPassWord,
        });
        if (code === 0) {
          navigate('/knowledge');
        }
      } else {
        const code = await register({
          nickname: params.nickname,
          email: params.email,
          password: rsaPassWord,
        });
        if (code === 0) {
          setTitle('login');
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>
          <div>{title === 'login' ? t('login') : t('register')}</div>
          {/*<span>*/}
          {/*  {title === 'login'*/}
          {/*    ? t('loginDescription')*/}
          {/*    : t('registerDescription')}*/}
          {/*</span>*/}
        </div>

        <Form
          form={form}
          layout="vertical"
          name="dynamic_rule"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="email"
            label={t('emailLabel')}
            rules={[{ required: true, message: t('emailPlaceholder') }]}
          >
            <Input size="large" placeholder={t('emailPlaceholder')} />
          </Form.Item>

          {title === 'register' && (
            <Form.Item
              name="nickname"
              label={t('nicknameLabel')}
              rules={[{ required: true, message: t('nicknamePlaceholder') }]}
            >
              <Input size="large" placeholder={t('nicknamePlaceholder')} />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            label={t('passwordLabel')}
            rules={[{ required: true, message: t('passwordPlaceholder') }]}
          >
            <Input.Password
              size="large"
              placeholder={t('passwordPlaceholder')}
              onPressEnter={onCheck}
            />
          </Form.Item>

          {title === 'login' && (
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox> {t('rememberMe')}</Checkbox>
            </Form.Item>
          )}

          {/*<div>*/}
          {/*  {title === 'login' && (*/}
          {/*    <div>*/}
          {/*      {t('signInTip')}*/}
          {/*      <Button type="link" onClick={changeTitle}>*/}
          {/*        {t('signUp')}*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*  {title === 'register' && (*/}
          {/*    <div>*/}
          {/*      {t('signUpTip')}*/}
          {/*      <Button type="link" onClick={changeTitle}>*/}
          {/*        {t('login')}*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*</div>*/}

          <Button
            type="primary"
            block
            size="large"
            onClick={onCheck}
            loading={loading}
          >
            {title === 'login' ? t('login') : t('continue')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
