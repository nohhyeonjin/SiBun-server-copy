import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions={  //jwt option ����
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),   //Authorization ������� jwt�� ã�� ������ ��
    secretOrKey : process.env.JWT_SECRET//��ū�� ��ȣȭ�ϱ� ���� ���ڿ� -> ������ ��а��� �˰� �Ǹ� ��ū�� ��� �ص� �� �� ����
};

const verifyUser=async(payload, done) =>{    //done�� ����ڸ� ã���� �� ȣ���ؾ� �ϴ� �Լ�
    try{
        const user = await prisma.user({id:payload.id});//����ڸ� ã��
        if(user!==null){
            return done(null,user); //user�� ã���� user�� �������ְ�
        }else{
            return done(null, false);   //user�� ��ã���� false�� ��������
        }
    }catch{
        done(error,false);
    }
}

export const authenticateJwt = (req,res,next)=> //authenticateJwt �̵��� ����Ǹ� passport authenticate�� �����
    passport.authenticate("jwt",{sessions:false}, (error, user)=>{
        if(user !==null){
            req.user=user;  //verifyUser���� ����ڸ� �޾� �� �Ŀ� ����ڰ� �����ϸ� ����� ������ req��ü�� �ٿ���
        }
        next();
    })(req,res,next);

passport.use(new Strategy(jwtOptions, verifyUser))//�ɼ��� �� �°� ����Ǿ��� �� JwtStrategy�Լ��� ��ū �ؼ��� -> �ؼ��� ������ verifyUser�� payload�� ��������
passport.initialize();

//����� ������ BEARER ���Ŀ� ��ū�� �Էµ�
{Authorization: 'Bearer TOKEN'}